const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createPassenger: async (req, res, next) => {
    const {
      fullname,
      passenger_type,
      born_date,
      citizen,
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
          citizen,
          identity_number,
          booking_id,
          // booking_id: booking.booking_id,
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
        data: passengers
      });
    } catch (error) {
      next(error);
    }
  },

  getByToken: async (req, res, next) => {
    const user = req.user;
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          user_id: user.user_id,
        },
        select: {
          booking_id: true,
        },
      });

      const booking_id = bookings.map(booking => booking.booking_id);

      const passengers = await prisma.passenger.findMany({
        where: {
          booking_id: {
            in: booking_id,
          },
        },
        include: {
          booking: true,
        },
      });

      return res.status(200).json({
        status: true,
        message: "Data pemesanan berhasil diambil",
        data: passengers
      });
    } catch (error) {
      next(error);
    }
  },

};
