/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `booking_id` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[booking_code]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_code` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `booking_id` on the `passengers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_booking_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ADD COLUMN     "booking_code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "booking_id",
ADD COLUMN     "booking_id" SERIAL NOT NULL,
ALTER COLUMN "isPaid" SET DEFAULT false,
ALTER COLUMN "payment_id" DROP NOT NULL,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id");

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "booking_id",
ADD COLUMN     "booking_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_code_key" ON "bookings"("booking_code");

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;
