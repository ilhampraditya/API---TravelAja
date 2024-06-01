const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createPaymentEwallet: async (req, res, next) => {
    const { payment_method, no_telp } = req.body;
    try {


      if (!payment_method || !no_telp) {
        return res.status(400).json({
          status: false,
          message: "field dibutuhkan !",
          data: null,
        });
      }

      const payment = await prisma.payment.create({
        data: {
          payment_method,
          no_telp
        },
      });


      return res.status(201).send({
        status: true,
        message: "Payment berhasil ditambahkan",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },
  createPaymentBank: async (req, res, next) => {
    const { payment_method, card_number, valid_until } = req.body;
    try {


      if (!payment_method || !card_number || !valid_until) {
        return res.status(400).json({
          status: false,
          message: "field dibutuhkan !",
          data: null,
        });
      }

      const payment = await prisma.payment.create({
        data: {
          payment_method,
          card_number,
          valid_until
        },
      });


      return res.status(201).send({
        status: true,
        message: "Payment berhasil ditambahkan",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },
};
