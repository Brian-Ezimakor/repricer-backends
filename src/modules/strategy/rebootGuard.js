function shouldReboot({
  rebootEnabled,
  isCompetitive,
  currentPrice,
  maxPrice,
}) {
  if (!rebootEnabled) return false;
  if (!isCompetitive) return false;
  if (currentPrice >= maxPrice - 1) return false;

  return true;
}

function getRebootPrice(maxPrice) {
  return maxPrice - 1;
}

module.exports = {
  shouldReboot,
  getRebootPrice,
};