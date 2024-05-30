const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getAllSeatBySeatClassId: async (req, res, next) => {
        const { seat_class_id } = req.params.id
        try {

            const seat = await prisma.seat.findMany({ where: { seat_class_id } });

            return res.status(200).json({
                status: true,
                message: "Data kursi berhasil diambil",
                data: seat,
            });
        } catch (error) {
            next(error);
        }
    },

    createSeat: async (req, res, next) => {
        const { seat_number, seat_class_id } = req.body;
        try {


            if (!seat_class_id || !seat_number) {
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

            if (seat_number > seatClassExist.seat_amount) {
                return res.status(400).json({
                    status: false,
                    message: `Jumlah maksimal nomor kursi adalah ${seatClassExist.seat_amount} !`,
                    data: null,
                });
            }


            const seatExist = await prisma.seat.findFirst({ where: { seat_number, seat_class_id } })
            if (seatExist) {
                return res.status(400).json({
                    status: false,
                    message: "Nomor kursi sudah ada!",
                    data: null,
                });
            }


            const seat = await prisma.seat.create({
                data: {
                    seat_number,
                    seat_class_id
                },
            });
            return res.status(201).send({
                status: true,
                message: "Kursi berhasil dibuat",
                data: seat,
            });
        } catch (error) {
            next(error);
        }
    },
};
