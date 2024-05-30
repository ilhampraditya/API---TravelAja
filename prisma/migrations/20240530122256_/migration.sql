/*
  Warnings:

  - You are about to drop the column `airline_id` on the `seatclass` table. All the data in the column will be lost.
  - Added the required column `airlines_id` to the `seatclass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "seatclass" DROP CONSTRAINT "seatclass_airline_id_fkey";

-- AlterTable
ALTER TABLE "seatclass" DROP COLUMN "airline_id",
ADD COLUMN     "airlines_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "seatclass" ADD CONSTRAINT "seatclass_airlines_id_fkey" FOREIGN KEY ("airlines_id") REFERENCES "airlines"("airline_id") ON DELETE RESTRICT ON UPDATE CASCADE;
