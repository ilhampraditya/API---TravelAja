-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_promotion_id_fkey";

-- AlterTable
ALTER TABLE "flights" ALTER COLUMN "promotion_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("promotion_id") ON DELETE SET NULL ON UPDATE CASCADE;
