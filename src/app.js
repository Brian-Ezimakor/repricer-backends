const express = require("express");
const { handleTakealotWebhook } = require("./modules/webhooks/takealotWebhook");

const app = express();

app.use(
  "/webhooks/takealot",
  express.raw({ type: "application/json" })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Repricer Backend",
    timestamp: new Date(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/webhooks/takealot", handleTakealotWebhook);

module.exports = app;