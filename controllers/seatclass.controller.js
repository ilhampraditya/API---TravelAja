const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getAllSeatClasses: async (req, res, next) => {
    try {
      const seatClasses = await prisma.seatClass.findMany();
      return res.status(200).send({
        status: true,
        message: "Data kelas kursi berhasil diambil",
        data: seatClasses,
      });
    } catch (error) {
      next(error);
    }
  },

  getSeatClassById: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const seatClass = await prisma.seatClass.findUnique({
        where: { seat_class_id: id }
      });

      if (!seatClass) {
        return res.status(404).send({
          status: false,
          message: 'Kelas kursi tidak ditemukan',
          data: null,
        });
      }
      res.status(200).send({
        status: true,
        message: "Data kelas kursi berhasil diambil",
        data: seatClass,
      });
    } catch (error) {
      next(error);
    }
  },

  createSeatClass: async (req, res, next) => {
    const { seat_class_type, seat_number } = req.body;
    try {
      const seatClass = await prisma.seatClass.create({
        data: {
          seat_class_type,
          seat_number,
        },
      });
      return res.status(201).send({
        status: true,
        message: "Kelas kursi berhasil dibuat",
        data: seatClass,
      });
    } catch (error) {
      next(error);
    }
  },
};
