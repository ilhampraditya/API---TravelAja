/*
  Warnings:

  - You are about to drop the column `booking_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_booking_id_fkey";

-- DropIndex
DROP INDEX "payments_booking_id_key";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "payment_id" INTEGER;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "booking_id";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_payment_id_key" ON "bookings"("payment_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;
