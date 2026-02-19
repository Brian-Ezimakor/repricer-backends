const { STATES, CONFIG } = require("./constants");

function classifyState({
  myPrice,
  competitorPrice,
  competitorCount,
  ownsBuyBox,
  lastPriceChangeAt,
  now,
  volatilityDetected,
}) {
  // Cooldown check
  const cooldownMs = CONFIG.COOLDOWN_MINUTES * 60 * 1000;
  if (lastPriceChangeAt && now - lastPriceChangeAt < cooldownMs) {
    return STATES.COOLDOWN_ACTIVE;
  }

  // No competition
  if (competitorCount === 0) {
    return STATES.NO_COMPETITION;
  }

  // Volatile market
  if (volatilityDetected) {
    return STATES.VOLATILE_MARKET;
  }

  const priceDiff = Math.abs(myPrice - competitorPrice);

  if (ownsBuyBox) {
    if (priceDiff >= CONFIG.WIDE_THRESHOLD) {
      return STATES.WINNING_SAFE;
    }
    return STATES.WINNING_EDGE;
  } else {
    if (priceDiff >= CONFIG.WIDE_THRESHOLD) {
      return STATES.LOSING_WIDE;
    }
    return STATES.LOSING_NARROW;
  }
}

module.exports = {
  classifyState,
};