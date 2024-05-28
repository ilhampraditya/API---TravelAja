const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllAirports: async (req, res, next) => {
    try {
      const airports = await prisma.airport.findMany();
      return res.status(200).send({
        status: true,
        message: "Data bandara berhasil diambil",
        data: airports,
      });
    } catch (error) {
      next(error);
    }
  },

  getAirportById: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const airport = await prisma.airport.findUnique({
        where: { id: id },
      });

      if (!airport) {
        return res.status(404).send({
          status: false,
          message: "Bandara tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).send({
        status: true,
        message: "Data bandara berhasil diambil",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },

  createAirport: async (req, res, next) => {
    const { airport_name, continent, country, city } = req.body;
    try {
      const airport = await prisma.airport.create({
        data: {
          airport_name,
          continent,
          country,
          city,
        },
      });

      return res.status(201).send({
        status: true,
        message: "Bandara berhasil dibuat",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },

  // updateAirport: async (req, res, next) => {
  //   const id = Number(req.params.id);
  //   const { airport_name, continent, country, city } = req.body;
  //   try {
  //     const airport = await prisma.airport.update({
  //       where: { id: id },
  //       data: {
  //         airport_name,
  //         continent,
  //         country,
  //         city,
  //       },
  //     });

  //     return res.status(200).send({
  //       status: true,
  //       message: "Data bandara berhasil diperbarui",
  //       data: airport,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // deleteAirport: async (req, res, next) => {
  //   const id = Number(req.params.id);
  //   try {
  //     await prisma.airport.delete({
  //       where: { id: id },
  //     });

  //     return res.status(200).send({
  //       status: true,
  //       message: "Bandara berhasil dihapus",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },
};
