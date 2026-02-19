const axios = require("axios");

let globalRateState = {
  remaining: null,
  resetTime: null,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function takealotRequest(config) {
  try {
    const response = await axios(config);

    const headers = response.headers;

    globalRateState.remaining =
      Number(headers["x-ratelimit-remaining"]) || null;

    const reset =
      Number(headers["x-ratelimit-reset"]) || null;

    if (reset) {
      globalRateState.resetTime = Date.now() + reset * 1000;
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Rate limit hit. Backing off...");

      const waitTime =
        globalRateState.resetTime
          ? globalRateState.resetTime - Date.now()
          : 3000;

      await sleep(waitTime > 0 ? waitTime : 3000);

      return takealotRequest(config); // retry
    }

    throw error;
  }
}

module.exports = {
  takealotRequest,
};