const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createPaymentEwallet: async (req, res, next) => {
    const { payment_method, no_telp, total_price } = req.body;
    const user_id = req.user.user_id; 

    try {
      if (!payment_method || !no_telp || !total_price) {
        return res.status(400).json({
          status: false,
          message: "Field dibutuhkan!",
          data: null,
        });
      }

      const bookings = await prisma.booking.findMany({
        where: { user_id, isPaid: false },
      });

      if (bookings.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Booking tidak ditemukan atau sudah dibayar",
          data: null,
        });
      }

      const payments = [];
      for (const booking of bookings) {
        const payment = await prisma.payment.create({
          data: {
            payment_method,
            no_telp,
            total_price,
            booking: {
              connect: { booking_id: booking.booking_id },
            },
          },
        });

        await prisma.booking.update({
          where: { booking_id: booking.booking_id },
          data: { isPaid: true },
        });

        payments.push(payment);
      }

      return res.status(201).send({
        status: true,
        message: "Pembayaran berhasil ditambahkan",
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },

  createPaymentBank: async (req, res, next) => {
    const { payment_method, card_number, valid_until, total_price } = req.body;
    const user_id = req.user.user_id; 

    try {
      if (!payment_method || !card_number || !valid_until || !total_price) {
        return res.status(400).json({
          status: false,
          message: "Field dibutuhkan!",
          data: null,
        });
      }
      const bookings = await prisma.booking.findMany({
        where: { user_id, isPaid: false },
      });

      if (bookings.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Booking tidak ditemukan atau sudah dibayar",
          data: null,
        });
      }

      const payments = [];
      for (const booking of bookings) {
        const payment = await prisma.payment.create({
          data: {
            payment_method,
            card_number,
            valid_until,
            total_price,
            booking: {
              connect: { booking_id: booking.booking_id },
            },
          },
        });

        await prisma.booking.update({
          where: { booking_id: booking.booking_id },
          data: { isPaid: true },
        });

        payments.push(payment);
      }

      return res.status(201).send({
        status: true,
        message: "Pembayaran berhasil ditambahkan",
        data: payments,
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
