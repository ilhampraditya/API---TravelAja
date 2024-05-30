/*
  Warnings:

  - You are about to drop the column `createdAt` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "createdAt",
ALTER COLUMN "booking_date" SET DEFAULT CURRENT_TIMESTAMP;
