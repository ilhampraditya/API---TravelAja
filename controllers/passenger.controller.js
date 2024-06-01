const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllPassenger: async (req, res, next) => {
    try {
      const passenger = await prisma.passenger.findMany();
      return res.status(200).json({
        status: true,
        message: "Data penumpang  berhasil diambil",
        data: passenger,
      });
    } catch (error) {
      next(error);
    }
  },

  createPassenger: async (req, res, next) => {
    try {
      const { fullname, passenger_type, born_date, citizen, identity_number, booking_code } = req.body;
      if (!fullname || !passenger_type || !born_date || !citizen || !identity_number || !booking_code) {
        return res.status(400).json({
            status: false,
            message: "Silahkan memasukkan semua fields!",
            data: null,
        });
    }
      const booking = await prisma.booking.findUnique({
        where: { booking_code }
      });

      if (!booking) {
        return res.status(404).json({
          status: false,
          message: "Booking not found"
        });
      }

      const newPassenger = await prisma.passenger.create({
        data: {
          fullname,
          passenger_type,
          born_date,
          citizen,
          identity_number,
          booking_id: booking.booking_id
        }
      });

      return res.status(201).json({
        status: true,
        message: "Penumpang berhasil dibuat",
        data: newPassenger,
      });
    } catch (error) {
      next(error);
    }
  },

};
