const express = require("express");
const { handleTakealotWebhook } = require("./modules/webhooks/takealotWebhook");

const app = express();
// app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/webhooks/takealot", handleTakealotWebhook);

// 🔥 products API
app.use(
  "/webhooks/takealot",
  express.raw({ type: "application/json" })
);

app.use(express.json());

module.exports = app;