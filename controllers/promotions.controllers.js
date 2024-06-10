const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createPromotion: async (req, res, next) => {
    const { discount, startDate, endDate } = req.body;

    try {
      const promo = await prisma.promotion.create({
        data: {
          discount,
          startDate,
          endDate,
        },
      });

      return res.status(201).json({
        status: true,
        message: "Promosi berhasil dibuat",
        data: promo,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllPromo: async (req, res, next) => {
    try {
      const promo = await prisma.promotion.findMany();
      return res.status(200).json({
        status: true,
        message: "Data Promosi berhasil diambil",
        data: promo,
      });
    } catch (error) {
      next(error);
    }
  },
};
