const imagekit = require('../libs/imagekit')
const path = require('path')
const qr = require('qr-image')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

module.exports = {
    uploadAvatar: async (req, res, next) => {
        try {

            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    message: "file tidak ada!",
                    data: null,
                });
            }


            let strFile = req.file.buffer.toString('base64')

            let { url } = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            })

            res.status(200).json({
                status: true,
                message: "file berhasil diunggah!",
                data: { avatar_url: url },
            });
        }
        catch (err) {
            next(err)
        }
    },
    generateQR: async (req, res, next) => {
        try {
            let { qr_data } = req.body

            if (!qr_data) {
                return res.status(400).json({
                    status: false,
                    message: 'qr_data is required',
                    data: null
                })
            }

            let qrCode = qr.imageSync(qr_data, { type: 'png' })

            let { url } = await imagekit.upload({
                fileName: Date.now() + '.png',
                file: qrCode.toString('base64')
            })

            res.status(200).json({
                status: true,
                message: 'OK',
                data: url
            })
        }
        catch (err) {
            next(err)
        }
    }
}