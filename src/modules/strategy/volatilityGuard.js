const { CONFIG } = require("./constants");

function evaluateVolatility({
  product,
  currentCompetitorPrice,
}) {
  let {
    lastCompetitorPrice,
    competitorChangeCount = 0,
    stableCycleCount = 0,
    isVolatile = false,
  } = product;

  // First-time tracking
  if (
    lastCompetitorPrice === null ||
    lastCompetitorPrice === undefined
  ) {
    return {
      lastCompetitorPrice: currentCompetitorPrice,
      competitorChangeCount: 0,
      stableCycleCount: 0,
      isVolatile: false,
    };
  }

  // Detect change
  const priceChanged =
    currentCompetitorPrice !== lastCompetitorPrice;

  if (priceChanged) {
    competitorChangeCount += 1;
    stableCycleCount = 0;
  } else {
    stableCycleCount += 1;

    // 🔥 Sliding decay:
    // If stable for 1 cycle, reduce change pressure gradually
    if (competitorChangeCount > 0) {
      competitorChangeCount -= 1;
    }
  }

  // Enter volatility
  if (
    competitorChangeCount >= CONFIG.VOLATILITY_CHANGE_LIMIT
  ) {
    isVolatile = true;
  }

  // Exit volatility after stability window
  if (
    isVolatile &&
    stableCycleCount >= CONFIG.STABILITY_REQUIRED
  ) {
    isVolatile = false;
    competitorChangeCount = 0;
    stableCycleCount = 0;
  }

  return {
    lastCompetitorPrice: currentCompetitorPrice,
    competitorChangeCount,
    stableCycleCount,
    isVolatile,
  };
}

module.exports = {
  evaluateVolatility,
};