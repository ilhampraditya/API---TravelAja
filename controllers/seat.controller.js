const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    getAllSeats: async (req, res, next) => {
        let { id } = req.params

        try {

            id = Number(id)

            const seats = await prisma.seat.findMany({
                where: {
                    seat_class_id: id
                }
            });

            return res.status(200).json({
                status: true,
                message: "Data kursi berhasil diambil",
                data: seats,
            });
        } catch (error) {
            next(error);
        }
    },
    getEmptySeatBySeatClassId: async (req, res, next) => {
        const { seat_class_id } = req.params.id
        try {

            const seats = await prisma.seat.findMany({
                where: {
                    seat_class_id,
                    OR: [
                        { status: 'AVAILABLE' },
                        { status: 'CHECK_AGAIN_LATER' }
                    ]
                }
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


            if (!seat_class_id) {
                return res.status(400).json({
                    status: false,
                    message: "field dibutuhkan !",
                    data: null,
                });
            }

            const seatClassExist = await prisma.seatClass.findUnique({ where: { seat_class_id } })

            if (!seatClassExist) {
                return res.status(400).json({
                    status: false,
                    message: "Kelas kursi tidak ditemukan!",
                    data: null,
                });
            }
            let seat_amount = seatClassExist.seat_amount

            for (let i = 1; i <= seat_amount; i++) {
                const seat = await prisma.seat.create({
                    data: {
                        seat_number: i,
                        seat_class_id
                    }
                });
            }

            return res.status(201).json({
                status: true,
                message: "Kursi berhasil dibuat",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    },

    getAllseat: async (req, res, next) => {
        try {
          const seat = await prisma.seat.findMany();
          return res.status(200).json({
            status: true,
            message: "Data seat berhasil diambil",
            data: seat,
          });
        } catch (error) {
          next(error);
        }
      },
};
