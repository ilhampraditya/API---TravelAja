const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const airports = require("../prisma/data/airport.json");
const airlines = require("../prisma/data/airlines.json");
const seatclass = require("../prisma/data/seatclass.json");
const flights = require("../prisma/data/flight.json");

async function main() {
  try {
    await prisma.airport.createMany({ data: airports.airports });
    console.log("Data seeding airport was successful");
    await prisma.airlines.createMany({ data: airlines.airlines });
    console.log("Data seeding airlines was successful");
    await prisma.seatClass.createMany({ data: seatclass.seatclass });
    console.log("Data seeding seatclass was successful");
    await prisma.flights.createMany({ data: flights.flights });
    console.log("Data seeding flight was successful");

    // Menghitung jumlah entitas di masing-masing tabel
    const airportCount = await prisma.airport.count();
    const airlinesCount = await prisma.airlines.count();
    const seatClassCount = await prisma.seatClass.count();
    const flightsCount = await prisma.flights.count();

    console.log(`Number of airports: ${airportCount}`);
    console.log(`Number of airlines: ${airlinesCount}`);
    console.log(`Number of seat classes: ${seatClassCount}`);
    console.log(`Number of flights: ${flightsCount}`);

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
