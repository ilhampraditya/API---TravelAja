require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    createAirport: async (req, res, next) => {
        try {
            const { airport_id, airport_name, continent, country, city } = req.body;

            if (!airport_id || !airport_name || !continent || !country || !city) {
                return res.status(400).json({
                    status: false,
                    message: "Harap menyediakan airport_id, nama bandara, benua, negara, dan kota",
                    data: null,
                });
            }

            // Periksa apakah airportId sudah ada
            const existingAirport = await prisma.airport.findUnique({
                where: {
                    id: airport_id,
                },
            });

            if (existingAirport) {
                return res.status(409).json({
                    status: false,
                    message: "Airport dengan ID ini sudah ada",
                    data: null,
                });
            }

            let newAirport = await prisma.airport.create({
                data: {
                    id: airport_id,
                    airport_name,
                    continent,
                    country,
                    city,
                },
            });

            res.status(201).json({
                status: true,
                message: "Pembuatan bandara berhasil",
                data: {
                    [newAirport.id]: {
                        airport_id: newAirport.id,
                        airport_name: newAirport.airport_name,
                        continent: newAirport.continent,
                        city: newAirport.city,
                        country: newAirport.country
                    }
                },
            });
        } catch (err) {
            next(err);
        }
    },


    getAllAirports: async (req, res, next) => {
        try {
            const { search } = req.query;

            const searchConditions = search
                ? {
                    OR: [
                        { airport_name: { contains: search, mode: "insensitive" } },
                        { city: { contains: search, mode: "insensitive" } }
                    ]
                }
                : {};

            const airports = await prisma.airport.findMany({
                where: searchConditions,
            });

            res.status(200).json({
                status: true,
                message: "Berhasil menampilkan semua bandara",
                data: airports,
            });
        } catch (err) {
            next(err);
        }
    },

    getAirportById: async (req, res, next) => {
        try {
            const { airport_id } = req.params;

            const airport = await prisma.airport.findUnique({
                where: { id: airport_id },
            });

            if (!airport) {
                return res.status(404).json({
                    status: false,
                    message: "Bandara tidak ditemukan",
                    data: null,
                });
            }

            res.status(200).json({
                status: true,
                message: "Berhasil menampilkan bandara",
                data: airport,
            });
        } catch (err) {
            next(err);
        }
    },

    editAirportById: async (req, res, next) => {
        try {
            const { airportId } = req.params;
            const { airport_name, continent, country, city } = req.body;

            if (!airport_name || !continent || !country || !city) {
                return res.status(400).json({
                    status: false,
                    message: "Harap menyediakan nama bandara, benua, negara, dan kota",
                    data: null,
                });
            }

            const airport = await prisma.airport.findUnique({
                where: { id: (airportId) },
            });

            if (!airport) {
                res.status(404).json({
                    status: false,
                    message: "Bandara tidak ditemukan",
                    data: null,
                })
            }

            let editedAirport = await prisma.airport.update({
                where: {
                    id: airportId,
                },
                data: {
                    airport_name,
                    continent,
                    country,
                    city,
                },
            });

            res.status(200).json({
                status: true,
                message: "Pembaharuan bandara berhasil",
                data: {
                    airportId: editedAirport.id,
                    airport_name: editedAirport.airport_name,
                    continent: editedAirport.continent,
                    country: editedAirport.country,
                    city: editedAirport.city
                },
            });

        } catch (error) {
            next(error)

        }
    },

    deleteAirport: async (req, res, next) => {
        try {
            const { airportId } = req.params;
            const airport = await prisma.airport.findUnique({
                where: { id: (airportId) },
            });
            if (!airport) {
                res.status(404).json({
                    status: false,
                    message: "Bandara tidak ditemukan",
                    data: null,
                })
            }
            const deletedAirport = await prisma.airport.delete({
                where: {
                    id: (airportId),
                },
            });

            res.status(200).json({
                status: true,
                message: "Penghapusan bandara berhasil",
                data: null,
            });

        } catch (error) {
            next(error)
        }
    },

}
