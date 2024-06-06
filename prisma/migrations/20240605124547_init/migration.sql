-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "no_telp" TEXT,
    "password" TEXT,
    "otp" INTEGER,
    "otpExpiration" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'user',
    "google_id" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "airline_id" TEXT NOT NULL,
    "airline_name" TEXT NOT NULL,
    "baggage" TEXT NOT NULL,
    "cabin_baggage" TEXT NOT NULL,
    "url_logo" TEXT,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("airline_id")
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
CREATE TABLE "seats" (
    "seat_id" SERIAL NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "seat_class_id" INTEGER NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "seatclass" (
    "seat_class_id" SERIAL NOT NULL,
    "seat_class_type" TEXT NOT NULL,
    "seat_amount" INTEGER NOT NULL,
    "airlines_id" TEXT NOT NULL,

    CONSTRAINT "seatclass_pkey" PRIMARY KEY ("seat_class_id")
);

-- CreateTable
CREATE TABLE "flights" (
    "flight_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "airline_id" TEXT NOT NULL,
    "arrival_airport_id" TEXT NOT NULL,
    "destination_airport_id" TEXT NOT NULL,
    "promotion_id" INTEGER,
    "seat_class_id" INTEGER NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("flight_id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "promotion_id" SERIAL NOT NULL,
    "discount" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "ticket_id" TEXT NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "passenger_id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "passenger_type" TEXT NOT NULL,
    "born_date" TIMESTAMP(3) NOT NULL,
    "citizen" TEXT NOT NULL,
    "identity_number" TEXT NOT NULL,
    "booking_id" INTEGER NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("passenger_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" SERIAL NOT NULL,
    "booking_code" TEXT NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "flight_id" TEXT NOT NULL,
    "payment_id" INTEGER,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "payment_method" TEXT NOT NULL,
    "no_telp" TEXT,
    "card_number" TEXT,
    "valid_until" TEXT,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_no_telp_key" ON "users"("no_telp");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_seat_id_key" ON "tickets"("seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_passenger_id_key" ON "tickets"("passenger_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_code_key" ON "bookings"("booking_code");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_payment_id_key" ON "bookings"("payment_id");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "seatclass"("seat_class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seatclass" ADD CONSTRAINT "seatclass_airlines_id_fkey" FOREIGN KEY ("airlines_id") REFERENCES "airlines"("airline_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "seatclass"("seat_class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("promotion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("airline_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_destination_airport_id_fkey" FOREIGN KEY ("destination_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passengers"("passenger_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;
