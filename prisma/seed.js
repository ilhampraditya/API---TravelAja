const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const airports = require("../prisma/data/airport.json");
const airlines = require("../prisma/data/airlines.json");
const seatclass = require("../prisma/data/seatclass.json");
const flights = require("../prisma/data/flight.json");
const promotions = require("../prisma/data/promotion.json");

async function main() {
  try {
    await prisma.airport.createMany({ data: airports.airports });
    console.log("Data seeding airport was successful");
    await prisma.airlines.createMany({ data: airlines.airlines });
    console.log("Data seeding airlines was successful");
    await prisma.seatClass.createMany({ data: seatclass.seatclass });
    console.log("Data seeding seatclass was successful");
    await prisma.promotion.createMany({ data: promotions.promotions });
    console.log("Data seeding promotions was successful");

    const flightIds = flights.flights.map((flight) => flight.flight_id);
    const duplicates = flightIds.filter(
      (value, index, self) => self.indexOf(value) !== index
    );

    if (duplicates.length > 0) {
      console.error(`Duplicate flight IDs found: ${duplicates}`);
      throw new Error(`Duplicate flight IDs found: ${duplicates}`);
    }

    for (const flight of flights.flights) {
      let total_price = flight.price;
      if (flight.promotion_id) {
        const promotion = promotions.promotions.find(
          (promo) => promo.promotion_id === flight.promotion_id
        );
        if (promotion) {
          total_price = flight.price - flight.price * (promotion.discount / 100);
        }
      }

      await prisma.flights.create({
        data: {
          ...flight,
          total_price,
        },
      });
    }
    console.log("Data seeding flights was successful");

    // Create seats for each seat class
    const seatClasses = await prisma.seatClass.findMany();
    for (const seatClass of seatClasses) {
      for (let i = 1; i <= seatClass.seat_amount; i++) {
        await prisma.seat.create({
          data: {
            seat_number: i,
            seat_class_id: seatClass.seat_class_id
          }
        });
      }
    }
    console.log("Seats creation for each seat class was successful");

    const airportCount = await prisma.airport.count();
    const airlinesCount = await prisma.airlines.count();
    const seatClassCount = await prisma.seatClass.count();
    const promotionsCount = await prisma.promotion.count();
    const flightsCount = await prisma.flights.count();
    const seatsCount = await prisma.seat.count();

    console.log(`Number of airports: ${airportCount}`);
    console.log(`Number of airlines: ${airlinesCount}`);
    console.log(`Number of seat classes: ${seatClassCount}`);
    console.log(`Number of promotions: ${promotionsCount}`);
    console.log(`Number of flights: ${flightsCount}`);
    console.log(`Number of seats: ${seatsCount}`);

    console.log("Data seeding was successful");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed data");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
