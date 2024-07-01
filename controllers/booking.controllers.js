const { PrismaClient } = require("@prisma/client");
const { search } = require("../routes/v1/booking.routes");
const prisma = new PrismaClient();
const { MIDTRANS_SERVER_KEY, FRONT_END_URL, MIDTRANS_APP_URL } = process.env;

module.exports = {
  getBookingById: async (req, res, next) => {
    const booking_code = req.params.id;
    const { user_id } = req.user;
    try {
      const booking = await prisma.booking.findUnique({
        where: { booking_code, user_id },
        include: {
          payment: true,
          flight: true,
          flight: {
            include: {
              airlines: true,
              seatclass: true,
              arrival_airport: true,
              destination_airport: true,
            },
          },
        },
      });

      const passengers = await prisma.passenger.findMany({
        where: { booking_id: booking.booking_id },
        include: { ticket: { include: { seat: true } } },
      });
      const passengerCount = passengers.length;

      const bookingWithMoreDetails = {
        ...booking,
        total_passengers: passengerCount,
        passengers: passengers,
      };

      return res.status(200).json({
        status: true,
        message: "Data pemesanan berhasil diambil",
        data: bookingWithMoreDetails,
      });
    } catch (error) {
      next(error);
    }
  },
  bookingHistory: async (req, res, next) => {
    const user = req.user;
    try {
      const bookings = await prisma.booking.findMany({
        where: { user_id: user.user_id },
        include: {
          payment: true,
          flight: true,
          flight: {
            include: {
              airlines: true,
              arrival_airport: true,
              destination_airport: true,
            },
          },
        },
      });

      const bookingWithPassengers = await Promise.all(
        bookings.map(async (booking) => {
          const passengers = await prisma.passenger.findMany({
            where: { booking_id: booking.booking_id },
          });
          const passengerCount = passengers.length;

          return {
            ...booking,
            total_passengers: passengerCount,
          };
        })
      );

      return res.status(200).json({
        status: true,
        message: "Data pemesanan berhasil diambil",
        data: bookingWithPassengers,
      });
    } catch (error) {
      next(error);
    }
  },

  createBooking: async (req, res, next) => {
    const user = req.user;
    const { flight_id } = req.body;
    try {
      const lastBooking = await prisma.booking.findFirst({
        orderBy: {
          booking_date: "desc",
        },
      });

      let booking_code;
      if (!lastBooking) {
        booking_code = "TVLAJA-000001";
      } else {
        const lastCode = lastBooking.booking_code;
        const numberPart = parseInt(lastCode.split("-")[1], 10);
        const newNumberPart = (numberPart + 1).toString().padStart(6, "0");
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
          flight_id,
        },
      });

      return res.status(201).json({
        status: true,
        message: "Pemesanan dibuat",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllBooking: async (req, res, next) => {
    try {
      const booking = await prisma.booking.findMany();
      return res.status(200).json({
        status: true,
        message: "Data maskapai penerbangan berhasil diambil",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },
  BookingProcess: async (req, res, next) => {
    const userData = req.user;
    const { flight_id, passengers } = req.body;

    try {
      const lastBooking = await prisma.booking.findFirst({
        orderBy: {
          booking_date: "desc",
        },
      });

      let booking_code;
      if (!lastBooking) {
        booking_code = "TRAVELPROD-000001";
      } else {
        const lastCode = lastBooking.booking_code;
        const numberPart = parseInt(lastCode.split("-")[1], 10);
        const newNumberPart = (numberPart + 1).toString().padStart(6, "0");
        booking_code = `TRAVELPROD-${newNumberPart}`;
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
          user_id: userData.user_id,
          flight_id,
        },
      });

      await Promise.all(
        passengers.map(async (passenger, index) => {
          const newDate = new Date(passenger.born_date);
          newDate.setUTCHours(0, 0, 0, 0);

          const createdPassenger = await prisma.passenger.create({
            data: {
              fullname: passenger.fullname,
              passenger_type: passenger.passenger_type,
              born_date: newDate,
              identity_number: passenger.identity_number,
              booking_id: booking.booking_id,
            },
          });

          let { seat_id } = passenger;

          const seatExist = await prisma.seat.findFirst({ where: { seat_id } });
          if (!seatExist) {
            return res.status(400).json({
              status: false,
              message: "Kursi tidak ditemukan!",
              data: null,
            });
          }

          const ticketExist = await prisma.ticket.findUnique({
            where: { seat_id },
          });

          if (ticketExist) {
            if (
              seatExist.status == "CHECK_AGAIN_LATER" ||
              seatExist.status == "BOOKED"
            ) {
              return res.status(400).json({
                status: false,
                message: "Kursi tidak bisa dipesan!",
                data: null,
              });
            }
          }

          const lastTicket = await prisma.ticket.findFirst({
            orderBy: {
              ticket_id: "desc",
            },
          });

          let ticket_id;
          if (!lastTicket) {
            ticket_id = "TVLAJADOM000001";
          } else {
            const lastCode = lastTicket.ticket_id;
            const numberPart = parseInt(lastCode.slice(-6), 10);
            const newNumberPart = (numberPart + 1 + index)
              .toString()
              .padStart(6, "0");
            ticket_id = `TVLAJADOM${newNumberPart}`;
          }

          const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

          await prisma.ticket.create({
            data: {
              seat_id,
              passenger_id: createdPassenger.passenger_id,
              ticket_id,
              expiresAt: expiresAt,
            },
          });
        })
      );

      const user = await prisma.user.findUnique({
        where: { user_id: booking.user_id },
      });

      const flight = await prisma.flights.findUnique({
        where: {
          flight_id: booking.flight_id,
        },
      });

      pricePerTicket = flight.total_price;

      const listpassengers = await prisma.passenger.findMany({
        where: {
          booking_id: booking.booking_id,
        },
      });

      for (const mypassenger of listpassengers) {
        const ticket = await prisma.ticket.findUnique({
          where: { passenger_id: mypassenger.passenger_id },
        });
        await prisma.seat.update({
          where: { seat_id: ticket.seat_id },
          data: { status: "CHECK_AGAIN_LATER" },
        });
      }

      const passengerTotal = Number(listpassengers.length);

      total_price = pricePerTicket * passengerTotal;

      transaction_id = booking_code;
      gross_amount = total_price;

      const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);

      const payload = {
        transaction_details: {
          order_id: transaction_id,
          gross_amount,
        },
        customer_details: {
          first_name: user.name,
          email: user.email,
        },
        callbacks: {
          finish: `${FRONT_END_URL}/selesai/${booking_code}`,
          error: `${FRONT_END_URL}/cancel/${booking_code}`,
          pending: `${FRONT_END_URL}/pending/${booking_code}`,
        },
      };

      const response = await fetch(
        `https://app.sandbox.midtrans.com/snap/v1/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${authString}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.status !== 201) {
        return res.status(500).json({
          status: "error",
          message: "Gagal membuat transaksi!",
        });
      }

      const payment = await prisma.payment.create({
        data: {
          total_price,
        },
      });

      const updatedBooking = await prisma.booking.update({
        where: { booking_code },
        data: {
          snap_token: data.token,
          snap_redirect_url: data.redirect_url,
          payment_id: payment.payment_id,
        },
      });

      return res.status(201).json({
        status: true,
        message: "Pemesanan dibuat",
        data: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  },
};
