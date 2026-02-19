const { classifyState } = require("./stateClassifier");
const { decidePrice } = require("./decisionEngine");

function processProduct({
  product,
  marketSnapshot,
  volatilityDetected,
  now,
}) {
  const state = classifyState({
    myPrice: product.price,
    competitorPrice: marketSnapshot.lowestCompetitorPrice,
    competitorCount: marketSnapshot.competitorCount,
    ownsBuyBox: marketSnapshot.ownsBuyBox,
    lastPriceChangeAt: product.lastPriceChangeAt,
    now,
    volatilityDetected,
  });

  const targetPrice = decidePrice({
    state,
    myPrice: product.price,
    competitorPrice: marketSnapshot.lowestCompetitorPrice,
    minPrice: product.minPrice,
    maxPrice: product.maxPrice,
  });

  return {
    state,
    targetPrice,
  };
}

module.exports = {
  processProduct,
};