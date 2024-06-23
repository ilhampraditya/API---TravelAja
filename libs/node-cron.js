const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
    const now = new Date();

    try {
        const expiredData = await prisma.ticket.findMany({
            where: {
                isActive: false,
                expiresAt: {
                    lt: now,
                },
            },
        });

        if (expiredData.length > 0) {
            expiredData.forEach(async ticket => {
                const passenger = await prisma.passenger.findUnique({ where: { passenger_id: ticket.passenger_id } })
                const booking = await prisma.booking.findUnique({ where: { booking_id: passenger.booking_id } })
                await prisma.payment.update({ where: { payment_id: booking.payment_id }, data: { status: 'CANCELED' } })
                await prisma.seat.update({ where: { seat_id: ticket.seat_id }, data: { status: 'AVAILABLE' } })
            });

            await prisma.ticket.deleteMany({
                where: {
                    isActive: false,
                    expiresAt: {
                        lt: now,
                    },
                },
            });

            console.log(`Deleted ${expiredData.length} expired tickets`);
        } else {
            console.log('No expired data to delete');
        }


    } catch (error) {
        console.error('Error deleting expired data:', error);
    }
});