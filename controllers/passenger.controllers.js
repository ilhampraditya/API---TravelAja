const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createPassenger: async (req, res, next) => {
    const {
      fullname,
      passenger_type,
      born_date,
      identity_number,
      booking_id,
    } = req.body;

    try {
      const newDate = new Date(born_date);
      newDate.setUTCHours(0, 0, 0, 0);

      const booking = await prisma.booking.findUnique({
        where: { booking_id },
      });

      if (!booking) {
        return res.status(400).json({
          status: false,
          message: "Kode pemesanan tidak valid!",
          data: null,
        });
      }

      const passenger = await prisma.passenger.create({
        data: {
          fullname,
          passenger_type,
          born_date: newDate,
          identity_number,
          booking_id
        },
        include: {
          booking: true,
        },
      });

      return res.status(201).json({
        status: true,
        message: "Penumpang berhasil dibuat",
        data: passenger,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPassenger: async (req, res, next) => {
    try {
      const passengers = await prisma.passenger.findMany({
        include: {
          booking: true,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Data penumpang berhasil diambil",
        data: passengers,
      });
    } catch (error) {
      next(error);
    }
  },

  getByBookingId: async (req, res, next) => {
    const user = req.user;
    const { booking_id } = req.params
    try {
      const passengers = await prisma.passenger.findMany({
        where: {
          booking_id
        }
      });

      return res.status(200).json({
        status: true,
        message: "Data penumpang berhasil diambil",
        data: passengers,
      });
    } catch (error) {
      next(error);
    }
  },
};
