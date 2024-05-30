/*
  Warnings:

  - You are about to drop the column `total_price` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `total_price` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "total_price";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL;
