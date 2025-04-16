/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `AddressTransfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductStorageBalance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeparationOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeparationOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockRequestItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Storage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StorageAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnitOfMeasure` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DepartmentsToPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionsToUsers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AddressTransfer" DROP CONSTRAINT "AddressTransfer_fromAddressId_fkey";

-- DropForeignKey
ALTER TABLE "AddressTransfer" DROP CONSTRAINT "AddressTransfer_productId_fkey";

-- DropForeignKey
ALTER TABLE "AddressTransfer" DROP CONSTRAINT "AddressTransfer_toAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductInventory" DROP CONSTRAINT "ProductInventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductInventory" DROP CONSTRAINT "ProductInventory_storageAddressId_fkey";

-- DropForeignKey
ALTER TABLE "ProductStorageBalance" DROP CONSTRAINT "ProductStorageBalance_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductStorageBalance" DROP CONSTRAINT "ProductStorageBalance_storageAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_groupProductId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_typeProductId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_unitOfMeasureId_fkey";

-- DropForeignKey
ALTER TABLE "SeparationOrderItem" DROP CONSTRAINT "SeparationOrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "SeparationOrderItem" DROP CONSTRAINT "SeparationOrderItem_separationOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SeparationOrderItem" DROP CONSTRAINT "SeparationOrderItem_storageAddressId_fkey";

-- DropForeignKey
ALTER TABLE "StockRequestItem" DROP CONSTRAINT "StockRequestItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "StockRequestItem" DROP CONSTRAINT "StockRequestItem_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "StockRequestItem" DROP CONSTRAINT "StockRequestItem_storageAddressId_fkey";

-- DropForeignKey
ALTER TABLE "StorageAddress" DROP CONSTRAINT "StorageAddress_storageId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentsToPermissions" DROP CONSTRAINT "_DepartmentsToPermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentsToPermissions" DROP CONSTRAINT "_DepartmentsToPermissions_B_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionsToUsers" DROP CONSTRAINT "_PermissionsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionsToUsers" DROP CONSTRAINT "_PermissionsToUsers_B_fkey";

-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "departmentId",
DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "AddressTransfer";

-- DropTable
DROP TABLE "Departments";

-- DropTable
DROP TABLE "GroupProduct";

-- DropTable
DROP TABLE "Logs";

-- DropTable
DROP TABLE "Permissions";

-- DropTable
DROP TABLE "ProductInventory";

-- DropTable
DROP TABLE "ProductStorageBalance";

-- DropTable
DROP TABLE "Products";

-- DropTable
DROP TABLE "SeparationOrder";

-- DropTable
DROP TABLE "SeparationOrderItem";

-- DropTable
DROP TABLE "StockRequest";

-- DropTable
DROP TABLE "StockRequestItem";

-- DropTable
DROP TABLE "Storage";

-- DropTable
DROP TABLE "StorageAddress";

-- DropTable
DROP TABLE "TypeProducts";

-- DropTable
DROP TABLE "UnitOfMeasure";

-- DropTable
DROP TABLE "_DepartmentsToPermissions";

-- DropTable
DROP TABLE "_PermissionsToUsers";

-- DropEnum
DROP TYPE "InventoryStatus";

-- DropEnum
DROP TYPE "LogType";

-- DropEnum
DROP TYPE "SeparationItemStatus";

-- DropEnum
DROP TYPE "SeparationStatus";

-- DropEnum
DROP TYPE "StockRequestStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
