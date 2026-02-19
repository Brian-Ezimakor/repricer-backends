require("dotenv").config();
const app = require("./app");
const { startScheduler } = require("./modules/scheduler/scheduler");
const { startMorningRebootScheduler } = require("./modules/scheduler/morningRebootScheduler");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Repricer running on port ${PORT}`);

  startScheduler();
  startMorningRebootScheduler();
});

