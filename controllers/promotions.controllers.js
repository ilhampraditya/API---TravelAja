const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getPagination = require('../libs/getPagination');

module.exports = {
  createPromotion: async (req, res, next) => {
    const { role } = req.user
    const { discount, startDate, endDate } = req.body;

    try {

      if (role !== 'admin') {
        return res.status(400).json({
          status: true,
          message: "Anda bukan admin!",
          data: null,
        });
      }

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

  getPromotion: async (req, res, next) => {
    try {
      const { page = 1, limit = 1 } = req.query;

      let whereQuery = { promotion_id: { not: null } };

      const flights = await prisma.flights.findMany({
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        where: whereQuery,
        include: {
          airlines: true,
          arrival_airport: true,
          destination_airport: true,
          promotion: true,
          seatclass: true
        },
      });

      let count = await prisma.flights.count({ where: whereQuery });
      const pagination = getPagination(req, page, limit, count);

      return res.status(200).json({
        status: true,
        message: "Data promo berhasil diambil",
        data: flights,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },
};
