const { STATES, CONFIG } = require("./constants");

function decidePrice({
  state,
  myPrice,
  competitorPrice,
  minPrice,
  maxPrice,
}) {
  let targetPrice = myPrice;

  switch (state) {
    case STATES.NO_COMPETITION:
      targetPrice = Math.min(myPrice + CONFIG.RECOVERY_STEP, maxPrice);
      break;

    case STATES.WINNING_SAFE:
      targetPrice = Math.min(myPrice + CONFIG.RECOVERY_STEP, maxPrice);
      break;

    case STATES.WINNING_EDGE:
      targetPrice = myPrice;
      break;

    case STATES.LOSING_NARROW:
      {
        const ideal = competitorPrice - CONFIG.UNDERCUT_DELTA;
        targetPrice = ideal >= minPrice ? ideal : Math.max(minPrice, myPrice);
      }
      break;

    case STATES.LOSING_WIDE:
      {
        const ideal = competitorPrice - CONFIG.UNDERCUT_DELTA;
        if (ideal >= minPrice) {
          targetPrice = ideal;
        } else if (minPrice <= competitorPrice) {
          targetPrice = minPrice;
        } else {
          targetPrice = myPrice;
        }
      }
      break;

    case STATES.VOLATILE_MARKET:
    case STATES.COOLDOWN_ACTIVE:
      targetPrice = myPrice;
      break;

    default:
      targetPrice = myPrice;
  }

  return targetPrice;
}

module.exports = {
  decidePrice,
};
