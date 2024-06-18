const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getTicketByBookingCode: async (req, res, next) => {
        const { booking_code } = req.params
        const { user_id } = req.user
        try {

            const booking = await prisma.booking.findUnique({ where: { booking_code, user_id } });


            if (!booking) {
                return res.status(404).json({
                    status: false,
                    message: "Data booking tidak ada!",
                    data: null,
                });
            }

            const passengers = await prisma.passenger.findMany({ where: { booking_id: booking.booking_id } })


            let tickets = [];

            for (const passenger of passengers) {
                const ticket = await prisma.ticket.findUnique({
                    where: { passenger_id: passenger.passenger_id },
                });
                if (ticket) {
                    tickets.push(ticket);
                }
            }

            if (!tickets) {
                return res.status(404).json({
                    status: true,
                    message: "Data tiket tidak ditemukan!",
                    data: tickets,
                });
            }

            return res.status(200).json({
                status: true,
                message: "Data tiket berhasil diambil",
                data: tickets,
            });
        } catch (error) {
            next(error);
        }
    },

    createTicket: async (req, res, next) => {
        const { seat_id, passenger_id } = req.body;
        try {
            if (!seat_id || !passenger_id) {
                return res.status(400).json({
                    status: false,
                    message: "field dibutuhkan !",
                    data: null,
                });
            }

            const seatExist = await prisma.seat.findFirst({ where: { seat_id } })
            if (!seatExist) {
                return res.status(400).json({
                    status: false,
                    message: "Kursi tidak ditemukan!",
                    data: null,
                });
            }

            const ticketExist = await prisma.ticket.findUnique({ where: { seat_id } })


            if (ticketExist) {
                if (seatExist.status == 'CHECK_AGAIN_LATER' || seatExist.status == 'BOOKED') {
                    return res.status(400).json({
                        status: false,
                        message: "Kursi tidak bisa dipesan!",
                        data: null,
                    });
                }

            }



            const lastTicket = await prisma.ticket.findFirst({
                orderBy: {
                    ticket_id: 'desc',
                },
            });

            let ticket_id;
            if (!lastTicket) {
                ticket_id = 'TVLAJADOM000001';
            } else {
                const lastCode = lastTicket.ticket_id;
                const numberPart = parseInt(lastCode.slice(-6), 10);
                const newNumberPart = (numberPart + 1).toString().padStart(6, '0');
                ticket_id = `TVLAJADOM${newNumberPart}`;
            }

            const passengerExist = await prisma.passenger.findUnique({ where: { passenger_id } })

            if (!passengerExist) {
                return res.status(400).json({
                    status: false,
                    message: "data Penumpang tidak ditemukan!",
                    data: null,
                });
            }

            const ticket = await prisma.ticket.create({
                data: {
                    seat_id,
                    passenger_id,
                    ticket_id
                },
            });

            return res.status(201).json({
                status: true,
                message: "Tiket berhasil dibuat",
                data: ticket,
            });
        } catch (error) {
            next(error);
        }
    },
};
