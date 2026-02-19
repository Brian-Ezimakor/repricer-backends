const prisma = require("../../prisma");
const { getQueueManager } = require("../scheduler/scheduler");
const crypto = require("crypto");

const TAKEALOT_WEBHOOK_SECRET = process.env.TAKEALOT_WEBHOOK_SECRET;

function verifySignature(rawBody, signatureHeader) {
  const hmac = crypto.createHmac("sha256", TAKEALOT_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  return digest === signatureHeader;
}

async function handleTakealotWebhook(req, res) {
  const signature = req.headers["x-takealot-signature"];
  const eventType = req.headers["x-takealot-event"];

  if (!signature) {
    return res.status(400).send("Missing signature");
  }

  const rawBody = req.rawBody;

  const isValid = verifySignature(rawBody, signature);

  if (!isValid) {
    return res.status(401).send("Invalid signature");
  }

  // Respond immediately (important: within 5 seconds)
  res.status(200).send("OK");

  // Process async (do not block response)
  setImmediate(() => {
    try {
      const payload = JSON.parse(rawBody.toString());

      console.log("Webhook received:", eventType);

      // Later:
      // Inject product into HIGH queue
      // queueManager.addToQueue(product, "HIGH");

    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  });
}

module.exports = {
  handleTakealotWebhook,
};