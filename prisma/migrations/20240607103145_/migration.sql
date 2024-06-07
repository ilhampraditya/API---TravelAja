/*
  Warnings:

  - You are about to drop the column `card_number` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `no_telp` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `valid_until` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "card_number",
DROP COLUMN "no_telp",
DROP COLUMN "payment_method",
DROP COLUMN "valid_until";
