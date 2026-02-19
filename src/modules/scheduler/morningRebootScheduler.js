const prisma = require("../../prisma");
const { getRebootPrice } = require("../strategy/rebootGuard");
const { getProductRebootMinute } = require("./rebootTimeHelper");

const REBOOT_HOUR = 6; // 06:00
const REBOOT_PAUSE_MINUTES = 20;

async function runMorningReboot() {
  const now = new Date();

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour !== REBOOT_HOUR) return;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      morningRebootEnabled: true,
    },
  });

  for (const product of products) {
    const productMinute = getProductRebootMinute(product.id);

    if (currentMinute !== productMinute) continue;

    // Already rebooted today?
    if (product.lastRebootAt) {
      const last = new Date(product.lastRebootAt);
      if (last.toDateString() === now.toDateString()) continue;
    }

    if (product.price >= product.maxPrice - 1) continue;

    const rebootPrice = getRebootPrice(product.maxPrice);

    await updateTakealotPrice(product, rebootPrice);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        price: rebootPrice,
        rebootUntil: new Date(
          now.getTime() + REBOOT_PAUSE_MINUTES * 60 * 1000
        ),
        lastRebootAt: now,
      },
    });
  }
}

function startMorningRebootScheduler() {
  setInterval(runMorningReboot, 60 * 1000); // check every minute
}

module.exports = {
  startMorningRebootScheduler,
};