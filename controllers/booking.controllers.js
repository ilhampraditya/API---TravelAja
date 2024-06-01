const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getAll: async (req, res, next) => {
        const user = req.user
        try {
            const booking = await prisma.booking.findMany({ where: { user_id: user.user_id } });

            return res.status(200).json({
                status: true,
                message: "Data pemesanan berhasil diambil",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    },

    createBooking: async (req, res, next) => {
        const user = req.user;
        const { flight_id } = req.body
        try {
            const lastBooking = await prisma.booking.findFirst({
                orderBy: {
                    booking_date: 'desc',
                },
            });

            let booking_code;
            if (!lastBooking) {
                booking_code = 'TVLAJA-000001';
            } else {
                const lastCode = lastBooking.booking_code;
                const numberPart = parseInt(lastCode.split('-')[1], 10);
                const newNumberPart = (numberPart + 1).toString().padStart(6, '0');
                booking_code = `TVLAJA-${newNumberPart}`;
            }

            if (!flight_id) {
                return res.status(400).json({
                    status: false,
                    message: "field dibutuhkan !",
                    data: null,
                });
            }

            const booking = await prisma.booking.create({
                data: {
                    booking_code,
                    user_id: user.user_id,
                    flight_id
                },
            });
            return res.status(201).send({
                status: true,
                message: "Pemesanan dibuat",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    },
};
