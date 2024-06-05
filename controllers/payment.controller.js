const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createPaymentEwallet: async (req, res, next) => {
    const { payment_method, no_telp, booking_code } = req.body;
    const user_id = req.user.user_id;

    try {
      if (!payment_method || !no_telp || !booking_code) {
        return res.status(400).json({
          status: false,
          message: "Field dibutuhkan!",
          data: null,
        });
      }

      const booking = await prisma.booking.findFirst({
        where: { user_id, isPaid: false, booking_code },
      });

      if (!booking) {
        return res.status(404).json({
          status: false,
          message: "Booking tidak ditemukan atau sudah dibayar",
          data: null,
        });
      }

      const flight = await prisma.flights.findUnique({
        where: {
          flight_id: booking.flight_id
        }

      })

      pricePerTicket = flight.price

      const passenger = await prisma.passenger.findMany({
        where: {
          booking_id: booking.booking_id
        }
      })

      const passengerTotal = Number(passenger.length)
      console.log(passengerTotal)

      total_price = pricePerTicket * passengerTotal

      const payment = await prisma.payment.create({
        data: {
          payment_method,
          no_telp,
          total_price
        }
      })

      await prisma.booking.update({
        where: { booking_id: booking.booking_id },
        data: { isPaid: true },
      });



      return res.status(201).json({
        status: true,
        message: "Pembayaran berhasil ditambahkan",
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  createPaymentBank: async (req, res, next) => {
    const { payment_method, card_number, valid_until, booking_code } = req.body;
    const user_id = req.user.user_id;

    try {
      if (!payment_method || !card_number || !valid_until || !booking_code) {
        return res.status(400).json({
          status: false,
          message: "Field dibutuhkan!",
          data: null,
        });
      }

      const booking = await prisma.booking.findFirst({
        where: { user_id, isPaid: false, booking_code },
      });

      if (!booking) {
        return res.status(404).json({
          status: false,
          message: "Booking tidak ditemukan atau sudah dibayar",
          data: null,
        });
      }

      const flight = await prisma.flights.findUnique({
        where: {
          flight_id: booking.flight_id
        }

      })

      pricePerTicket = flight.price

      const passenger = await prisma.passenger.findMany({
        where: {
          booking_id: booking.booking_id
        }
      })

      const passengerTotal = Number(passenger.length)
      console.log(passengerTotal)

      total_price = pricePerTicket * passengerTotal

      const payment = await prisma.payment.create({
        data: {
          payment_method,
          card_number,
          valid_until,
          total_price
        }
      })

      await prisma.booking.update({
        where: { booking_id: booking.booking_id },
        data: { isPaid: true },
      });



      return res.status(201).json({
        status: true,
        message: "Pembayaran berhasil ditambahkan",
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  getPayment: async (req, res, next) => {
    try {
      const payment = await prisma.payment.findMany();
      return res.status(200).json({
        status: true,
        message: "Data pembayaran berhasil diambil",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },
};
