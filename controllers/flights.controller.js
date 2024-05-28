const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllFlights: async (req, res, next) => {
    try {
      const flights = await prisma.flights.findMany({
        include: {
          airlines: true,
          arrival_airport_code: true,
          destination_airport_code: true,
        },
      });

      return res.status(200).send({
        status: true,
        message: "Data penerbangan berhasil diambil",
        data: flights,
      });
    } catch (error) {
      next(error);
    }
  },

  getFlightById: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const flight = await prisma.flights.findUnique({
        where: { flight_id: id },
        include: {
          airlines: true,
          arrival_airport_code: true,
          destination_airport_code: true,
        },
      });

      if (!flight) {
        return res.status(404).send({
          status: false,
          message: "Penerbangan tidak ditemukan",
          data: null,
        });
      }

      res.status(200).send({
        status: true,
        message: "Data penerbangan berhasil diambil",
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  },

  createFlight: async (req, res, next) => {
    const {
      flight_code,
      price,
      date,
      departure_time,
      arrival_time,
      airline_id,
      arrival_airport_id,
      destination_airport_id,
    } = req.body;

    try {
      // Periksa apakah airline_id ada di tabel airlines
      const airlineExists = await prisma.airlines.findUnique({
        where: { airline_id: airline_id },
      });

      if (!airlineExists) {
        return res.status(400).send({
          status: false,
          message: "Airline tidak ditemukan",
          data: null,
        });
      }

      // Periksa apakah arrival_airport_id dan destination_airport_id ada di tabel airports
      const arrivalAirportExists = await prisma.airport.findUnique({
        where: { id: arrival_airport_id },
      });

      const destinationAirportExists = await prisma.airport.findUnique({
        where: { id: destination_airport_id },
      });

      if (!arrivalAirportExists || !destinationAirportExists) {
        return res.status(400).send({
          status: false,
          message: "Salah satu atau kedua bandara tidak ditemukan",
          data: null,
        });
      }

      const flight = await prisma.flights.create({
        data: {
          flight_code,
          price,
          date,
          departure_time,
          arrival_time,
          arrival_airport_id,
          destination_airport_id,
          airline_id,
        },
      });

      return res.status(201).send({
        status: true,
        message: "Penerbangan berhasil dibuat",
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  },
};
