import "dotenv/config";
import prisma from "../src/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@repricer.com",
      subscriptionStatus: "ACTIVE",
    },
  });

  const store = await prisma.store.create({
    data: {
      userId: user.id,
      storeName: "Test Takealot Store",
      takealotSellerId: "SELLER123",
      apiKey: "fake-api-key",
    },
  });

  await prisma.storeStrategy.create({
    data: {
      storeId: store.id,
      aggressionLevel: 3,
      minMarginPercent: 18,
      enableAutoReset: true,
    },
  });

  const product = await prisma.product.create({
    data: {
      storeId: store.id,
      sku: "SKU-001",
      cost: 100,
      currentPrice: 150,
      minPrice: 120,
      maxPrice: 200,
    },
  });

  await prisma.skuState.create({
    data: {
      productId: product.id,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });