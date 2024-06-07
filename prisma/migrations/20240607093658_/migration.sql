-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "snap_redirect_url" TEXT,
ADD COLUMN     "snap_token" TEXT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';
