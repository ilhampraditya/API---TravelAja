const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getTicketByBookingCode: async (req, res, next) => {
        const { booking_code } = req.params
        const { user_id } = req.user
        try {
            const booking = await prisma.booking.findUnique({
                where: { booking_code, user_id },
                include: {
                    flight: {
                        include: {
                            airlines: true,
                            seatclass: true,
                            arrival_airport: true,
                            destination_airport: true
                        }
                    },
                    passenger: {
                        include: { ticket: true }
                    },
                },
            });

            if (!booking) {
                return res.status(404).json({
                    status: false,
                    message: "Data Tiket tidak ada!",
                    data: null,
                });
            }

            const passengers = await prisma.passenger.findMany({
                where: { booking_id: booking.booking_id },
                include: { ticket: true }
            });

            const passengerCount = passengers.length;

            // Prepare response with structured data
            const response = {
                booking_id: booking.booking_id,
                booking_code: booking.booking_code,
                user_id: booking.user_id,
                flight_id: booking.flight_id,
                payment_id: booking.payment_id,
                snap_token: booking.snap_token,
                snap_redirect_url: booking.snap_redirect_url,
                flight: booking.flight,
                total_passengers: passengerCount,
            };

            if (passengerCount > 0) {
                response.passengers = passengers;
            }

            return res.status(200).json({
                status: true,
                message: "Data tiket berhasil diambil",
                data: response,
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
