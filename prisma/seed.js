const { PrismaClient } = require('@prisma/client');
const data = require('./data.json');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    await prisma.airport.createMany({ data: data.airports });
    await prisma.seatClass.createMany({ data: data.seatClasses });
    await prisma.airlines.createMany({ data: data.airlines });
    await prisma.flights.createMany({ data: data.flights });

    for (const user of data.users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });
    }

    console.log('Data seeding was successful');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });