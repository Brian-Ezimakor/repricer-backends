/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `basePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `morningResetOn` on the `Product` table. All the data in the column will be lost.
  - Added the required column `cost` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "basePrice",
DROP COLUMN "costPrice",
DROP COLUMN "morningResetOn",
ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "storeId" TEXT NOT NULL,
ADD COLUMN     "targetMarginPercent" DOUBLE PRECISION,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "minPrice" DROP NOT NULL,
ALTER COLUMN "minPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "currentPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxPrice" DROP NOT NULL,
ALTER COLUMN "maxPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "overridePrice" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'TRIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "takealotSellerId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreStrategy" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "aggressionLevel" INTEGER NOT NULL DEFAULT 3,
    "minMarginPercent" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "resetHour" INTEGER NOT NULL DEFAULT 6,
    "peakStartHour" INTEGER NOT NULL DEFAULT 9,
    "peakEndHour" INTEGER NOT NULL DEFAULT 21,
    "cooldownMinutes" INTEGER NOT NULL DEFAULT 60,
    "enableAutoReset" BOOLEAN NOT NULL DEFAULT true,
    "enableAntiPriceWar" BOOLEAN NOT NULL DEFAULT true,
    "enableSmartAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkuState" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "isBuyBoxWinner" BOOLEAN NOT NULL DEFAULT false,
    "winCounter" INTEGER NOT NULL DEFAULT 0,
    "lossCounter" INTEGER NOT NULL DEFAULT 0,
    "freezeUntil" TIMESTAMP(3),
    "lastAlertSentAt" TIMESTAMP(3),
    "lastStateChangeAt" TIMESTAMP(3),
    "buyBoxWinRate24h" DOUBLE PRECISION,
    "priceChangeCount24h" INTEGER NOT NULL DEFAULT 0,
    "lowestPrice24h" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkuState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertLog" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StoreStrategy_storeId_key" ON "StoreStrategy"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "SkuState_productId_key" ON "SkuState"("productId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreStrategy" ADD CONSTRAINT "StoreStrategy_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkuState" ADD CONSTRAINT "SkuState_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
