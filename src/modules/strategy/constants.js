const STATES = {
  NO_COMPETITION: "NO_COMPETITION",
  WINNING_SAFE: "WINNING_SAFE",
  WINNING_EDGE: "WINNING_EDGE",
  LOSING_NARROW: "LOSING_NARROW",
  LOSING_WIDE: "LOSING_WIDE",
  VOLATILE_MARKET: "VOLATILE_MARKET",
  COOLDOWN_ACTIVE: "COOLDOWN_ACTIVE",
};

const CONFIG = {
  NARROW_THRESHOLD: 2,      // R1–R2 difference
  WIDE_THRESHOLD: 3,        // R3+
  UNDERCUT_DELTA: 1,        // Always R1
  RECOVERY_STEP: 1,         // Raise by R1
  COOLDOWN_MINUTES: 3,
  VOLATILITY_CHANGE_LIMIT: 2,   // 2 changes
  VOLATILITY_WINDOW: 3,         // in last 3 cycles
  STABILITY_REQUIRED: 2,        // 2 stable cycles to exit volatility
};

module.exports = {
  STATES,
  CONFIG,
};
