/*
  Warnings:

  - The primary key for the `flights` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `flight_id` on the `flights` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "flights" DROP CONSTRAINT "flights_pkey",
DROP COLUMN "flight_id",
ADD CONSTRAINT "flights_pkey" PRIMARY KEY ("flight_code");
