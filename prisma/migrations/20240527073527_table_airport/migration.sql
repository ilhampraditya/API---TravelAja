-- CreateTable
CREATE TABLE "airports" (
    "id" TEXT NOT NULL,
    "airport_name" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);
