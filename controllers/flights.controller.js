const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllFlights: async (req, res, next) => {
    try {
      const flights = await prisma.flights.findMany({
        include: {
          airlines: true,
          departure_airport: true,
          destination_airport: true,
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
          departure_airport: true,
          destination_airport: true,
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
      status,
      origin_airport_id,
      destination_airport_id,
      airline_id,
    } = req.body;

    try {
      const flight = await prisma.flights.create({
        data: {
          flight_code,
          price,
          date,
          departure_time,
          arrival_time,
          status,
          origin_airport_id,
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
