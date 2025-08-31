/*
  Warnings:

  - A unique constraint covering the columns `[clientId,itemId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Favorite_clientId_key";

-- AlterTable
ALTER TABLE "public"."Favorite" ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_clientId_itemId_key" ON "public"."Favorite"("clientId", "itemId");
