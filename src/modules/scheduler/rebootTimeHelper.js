function getProductRebootMinute(productId) {
  // Deterministic jitter based on product ID
  // Ensures same product reboots at same minute daily
  const hash = productId % 7; // 0–6
  return hash;
}

module.exports = {
  getProductRebootMinute,
};