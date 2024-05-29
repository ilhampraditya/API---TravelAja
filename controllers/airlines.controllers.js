// airlines.controller.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllAirlines: async (req, res, next) => {
    try {
      const airlines = await prisma.airlines.findMany({
        include: { SeatClass: true },
      });
      return res.status(200).json({
        status: true,
        message: "Data maskapai penerbangan berhasil diambil",
        data: airlines,
      });
    } catch (error) {
      next(error);
    }
  },


  createAirline: async (req, res, next) => {
    const { airline_id,
      airline_name,
      baggage,
      cabin_baggage,
      seat_class_id
    } = req.body;

    try {
      const existingSeatClass = await prisma.seatClass.findUnique({
        where: { seat_class_id: seat_class_id },
      });

      if (!existingSeatClass) {
        return res.status(400).send({
          status: false,
          message: "Seat class with the provided ID does not exist",
          data: null,
        });
      }

      const airline = await prisma.airlines.create({
        data: {
          airline_id,
          airline_name,
          baggage,
          cabin_baggage,
          SeatClass: {
            connect: { seat_class_id: seat_class_id },
          },
        },
      });

      return res.status(201).json({
        status: true,
        message: "Maskapai penerbangan berhasil dibuat",
        data: airline,
      });
    } catch (error) {
      next(error);
    }
  },
};
