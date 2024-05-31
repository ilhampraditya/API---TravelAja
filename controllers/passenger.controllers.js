const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createPassenger: async (req, res, next) => {
        const {
            fullname,
            passenger_type,
            born_date,
            citizen,
            identity_number,
            booking_id
        } = req.body;

        try {
            const passenger = await prisma.passenger.create({
                data: {
                    fullname,
                    passenger_type,
                    born_date,
                    citizen,
                    identity_number,
                    booking_id
                },
                 include: {
                    booking: true  // Include the booking details in the response
                }
            });

            return res.status(201).json({
                status: true,
                message: "Penumpang berhasil dibuat",
                data: passenger,
            });
        } catch (error) {
            next(error);
        }
    },

    getAllPassenger: async (req, res, next) => {
        try {
            const passengers = await prisma.passenger.findMany();
            return res.status(200).json({
                status: true,
                message: "Data penumpang berhasil diambil",
                data: passengers,
            });
        } catch (error) {
            next(error);
        }
    },
    getAllByToken: async (req, res, next) => {
        const user = req.user;
        try {
            const bookings = await prisma.booking.findMany({
                where: { user_id: user.user_id },
                include: {
                    passenger: true 
                }
            });

            return res.status(200).json({
                status: true,
                message: "Data pemesanan berhasil diambil",
                data: bookings,
            });
        } catch (error) {
            next(error);
        }
    },
}
