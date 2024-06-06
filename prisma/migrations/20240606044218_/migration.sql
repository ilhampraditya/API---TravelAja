/*
  Warnings:

  - Added the required column `url_qrcode` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "url_qrcode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
