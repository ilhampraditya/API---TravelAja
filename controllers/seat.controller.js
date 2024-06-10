const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getEmptySeatBySeatClassId: async (req, res, next) => {
    const { seat_class_id } = req.params.id;
    try {
      const seats = await prisma.seat.findMany({
        where: {
          seat_class_id,
          OR: [{ status: "AVAILABLE" }, { status: "CHECK_AGAIN_LATER" }],
        },
      });

      return res.status(200).json({
        status: true,
        message: "Data kursi kosong berhasil diambil",
        data: seats,
      });
    } catch (error) {
      next(error);
    }
  },

  createSeat: async (req, res, next) => {
    const { seat_class_id } = req.body;
    try {
      if (!seatClassExist) {
        return res.status(400).json({
          status: false,
          message: "Kelas kursi tidak ditemukan!",
          data: null,
        });
      }

      if (!seat_class_id) {
        return res.status(400).json({
          status: false,
          message: "field dibutuhkan !",
          data: null,
        });
      }

      const seatExist = await prisma.seat.findFirst({
        where: { seat_number, seat_class_id },
      });

      if (!seatClassExist) {
        return res.status(400).json({
          status: false,
          message: "Kelas kursi tidak ditemukan!",
          data: null,
        });
      }
      let seat_amount = seatClassExist.seat_amount;

      for (let i = 1; i <= seat_amount; i++) {
        const seat = await prisma.seat.create({
          data: {
            seat_number: i,
            seat_class_id,
          },
        });
      }

      return res.status(201).send({
        status: true,
        message: "Kursi berhasil dibuat",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
