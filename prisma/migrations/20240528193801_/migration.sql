/*
  Warnings:

  - The primary key for the `airlines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `seatClassSeat_class_id` on the `airlines` table. All the data in the column will be lost.
  - You are about to drop the column `seat_class_code` on the `seatclass` table. All the data in the column will be lost.
  - You are about to drop the column `seat_class_name` on the `seatclass` table. All the data in the column will be lost.
  - Added the required column `promotion_id` to the `flights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seat_class_type` to the `seatclass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seat_number` to the `seatclass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "airlines" DROP CONSTRAINT "airlines_seatClassSeat_class_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_airline_id_fkey";

-- AlterTable
ALTER TABLE "airlines" DROP CONSTRAINT "airlines_pkey",
DROP COLUMN "seatClassSeat_class_id",
ADD COLUMN     "Seat_class_id" INTEGER,
ALTER COLUMN "airline_id" DROP DEFAULT,
ALTER COLUMN "airline_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "airlines_pkey" PRIMARY KEY ("airline_id");
DROP SEQUENCE "airlines_airline_id_seq";

-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "promotion_id" INTEGER NOT NULL,
ALTER COLUMN "airline_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "seatclass" DROP COLUMN "seat_class_code",
DROP COLUMN "seat_class_name",
ADD COLUMN     "seat_class_type" TEXT NOT NULL,
ADD COLUMN     "seat_number" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "promotions" (
    "promotion_id" SERIAL NOT NULL,
    "discount" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("promotion_id")
);

-- AddForeignKey
ALTER TABLE "airlines" ADD CONSTRAINT "airlines_Seat_class_id_fkey" FOREIGN KEY ("Seat_class_id") REFERENCES "seatclass"("seat_class_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("promotion_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("airline_id") ON DELETE RESTRICT ON UPDATE CASCADE;
