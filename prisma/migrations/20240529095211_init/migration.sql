-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "no_telp" TEXT,
    "password" TEXT NOT NULL,
    "otp" INTEGER,
    "otpExpiration" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'user',
    "google_id" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" TEXT NOT NULL,
    "airport_name" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "airline_id" TEXT NOT NULL,
    "airline_name" TEXT NOT NULL,
    "baggage" TEXT NOT NULL,
    "cabin_baggage" TEXT NOT NULL,
    "Seat_class_id" INTEGER,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("airline_id")
);

-- CreateTable
CREATE TABLE "seatclass" (
    "seat_class_id" SERIAL NOT NULL,
    "seat_class_type" TEXT NOT NULL,
    "seat_number" INTEGER NOT NULL,

    CONSTRAINT "seatclass_pkey" PRIMARY KEY ("seat_class_id")
);

-- CreateTable
CREATE TABLE "flights" (
    "flight_code" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "airline_id" TEXT NOT NULL,
    "arrival_airport_id" TEXT NOT NULL,
    "destination_airport_id" TEXT NOT NULL,
    "promotion_id" INTEGER,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("flight_code")
);

-- CreateTable
CREATE TABLE "promotions" (
    "promotion_id" SERIAL NOT NULL,
    "discount" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_no_telp_key" ON "users"("no_telp");

-- AddForeignKey
ALTER TABLE "airlines" ADD CONSTRAINT "airlines_Seat_class_id_fkey" FOREIGN KEY ("Seat_class_id") REFERENCES "seatclass"("seat_class_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("promotion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("airline_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_destination_airport_id_fkey" FOREIGN KEY ("destination_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
