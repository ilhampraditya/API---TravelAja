const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getAllSeatClasses: async (req, res, next) => {
    try {
        const { search } = req.query;
        const searchConditions = search
            ? {
                OR: [
                    { seat_class_type: { contains: search, mode: "insensitive" } },
                    { seat_number: { contains: search, mode: "insensitive" } }
                ]
            }
            : {};

        const seatClass = await prisma.seatClass.findMany({
            where: searchConditions,
        });
      return res.status(200).json({
        status: true,
        message: "Data kelas kursi berhasil diambil",
        data: seatClass,
      });
    } catch (error) {
      next(error);
    }
  },

  createSeatClass: async (req, res, next) => {
    const { seat_class_type, seat_amount, airlines_id } = req.body;
    try {
      const seatClass = await prisma.seatClass.create({
        data: {
          seat_class_type,
          seat_amount,
          airlines: { connect: { airline_id: airlines_id } },
        },
      });

      const airlineExists = await prisma.airlines.findUnique({
        where: { airline_id: airlines_id },
      });
      
      if (!airlineExists) {
        return res.status(404).send({
          status: false,
          message: "airlines_id tidak ditemukan",
        });
      }

      return res.status(201).json({
        status: true,
        message: "Kelas kursi berhasil dibuat",
        data: seatClass,
      });
    } catch (error) {
      next(error);
    }
  },
};
