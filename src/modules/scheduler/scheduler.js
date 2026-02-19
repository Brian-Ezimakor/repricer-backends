const prisma = require("../../prisma");
const QueueManager = require("./queueManager");
const { processProduct } = require("../strategy/orchestrator");
const { evaluateVolatility } = require("../strategy/volatilityGuard");

const queueManager = new QueueManager();

function getQueueManager() {
  return queueManager;
}

const MAX_PER_TICK = 10;

function getPriority(state) {
  switch (state) {
    case "LOSING_NARROW":
    case "LOSING_WIDE":
    case "WINNING_EDGE":
    case "VOLATILE_MARKET":
      return "HIGH";

    case "WINNING_SAFE":
      return "MEDIUM";

    case "NO_COMPETITION":
      return "LOW";

    default:
      return null;
  }
}

async function refillQueues() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  });

  const now = Date.now();

  for (const product of products) {
    if (
      product.rebootUntil &&
      new Date() < new Date(product.rebootUntil)
    ) continue;

    const priority = getPriority(product.currentState);
    if (!priority) continue;

    const interval = queueManager.getInterval(priority);

    if (
      product.lastCheckedAt &&
      now - new Date(product.lastCheckedAt).getTime() < interval
    ) continue;

    queueManager.addToQueue(product, priority);
  }
}

async function processQueues() {
  let processed = 0;

  while (processed < MAX_PER_TICK) {
    const product = queueManager.getNextProduct();
    if (!product) break;

    const marketSnapshot = await fetchMarketData(product);

    const volatilityResult = evaluateVolatility({
      product,
      currentCompetitorPrice: marketSnapshot.lowestCompetitorPrice,
    });

    await prisma.product.update({
      where: { id: product.id },
      data: volatilityResult,
    });

    const result = processProduct({
      product: { ...product, ...volatilityResult },
      marketSnapshot,
      volatilityDetected: volatilityResult.isVolatile,
      now: Date.now(),
    });

    if (result.targetPrice !== product.price) {
      await updateTakealotPrice(product, result.targetPrice);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: result.targetPrice,
          lastPriceChangeAt: new Date(),
        },
      });
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        currentState: result.state,
        lastCheckedAt: new Date(),
      },
    });

    processed++;
  }
}

async function runScheduler() {
  await refillQueues();
  await processQueues();
}

function startScheduler() {
  setInterval(runScheduler, 60 * 1000);
}

module.exports = {
  startScheduler,
  getQueueManager,
};
