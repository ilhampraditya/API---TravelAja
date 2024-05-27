require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { JWT_SECRET_KEY } = process.env;
const { formatdate } = require('../libs/formatdate')
const nodemailer = require("../libs/nodemailer");
const { getHTML, sendMail } = require("../libs/nodemailer");
const { generateOTP } = require("../libs/otpGenerator");


module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, no_telp, password } = req.body;

            if (!name || !email || !no_telp || !password) {
                return res.status(400).json({
                    status: false,
                    message: "Nama, email, no_telp, dan password dibutuhkan!",
                    data: null,
                });
            }

            const emailExist = await prisma.user.findUnique({ where: { email } });
            if (emailExist) {
                return res.status(401).json({
                    status: false,
                    message: "Email telah digunakan!",
                    data: null,
                });
            }

            const noTelpExist = await prisma.user.findUnique({ where: { no_telp } });
            if (noTelpExist) {
                return res.status(401).json({
                    status: false,
                    message: "No. Telp telah digunakan!",
                    data: null,
                });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            const otp = generateOTP();
            const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    no_telp,
                    password: encryptedPassword,
                    otp,
                    otpExpiration,
                    role: "user",
                    isVerified: false,
                    created_at: formatdate(new Date()),
                    updated_at: formatdate(new Date()),
                },
            });

            const subject = "Verifikasi OTP";

            const emailContent = await getHTML("otp-email.ejs", { otp });

            await sendMail(user.email, subject, emailContent);

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, { expiresIn: '1d' });

            return res.status(201).json({
                status: true,
                message:
                    "User telah berhasil terdaftar. Silakan periksa email Anda untuk OTP.",
                data: { token: token },
            });
        } catch (error) {
            next(error);
        }
    },

    renewOTP: async (req, res, next) => {
        try {
            const { email } = req.body;

            // Cari pengguna berdasarkan token verifikasi
            const user = await prisma.user.findFirst({
                where: { email },
            });

            // Jika pengguna tidak ditemukan
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "Token verifikasi tidak valid",
                    data: null,
                });
            }

            // Jika pengguna sudah diverifikasi
            if (user.isVerified) {
                return res.status(400).json({
                    status: false,
                    message:
                        "Pengguna sudah diverifikasi dan tidak dapat memperbarui OTP",
                    data: null,
                });
            }

            // Validasi email yang diberikan harus sesuai dengan email pengguna
            if (user.email !== email) {
                return res.status(400).json({
                    status: false,
                    message: "Email tidak cocok dengan pengguna yang terdaftar",
                    data: null,
                });
            }

            // Generate OTP baru
            const otp = generateOTP();
            const newEmailToken = crypto.randomBytes(16).toString("hex");

            // Perbarui OTP dan waktu kedaluwarsa
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otp: otp,
                    otpExpiration: new Date(Date.now() + 5 * 60 * 1000), // Sesuaikan dengan kebutuhan Anda
                    updated_at: formatdate(new Date()),
                },
            });

            const subject = "Verifikasi OTP Baru";
            const emailContent = await getHTML("otp-email.ejs", { otp });

            // Kirim email verifikasi
            await sendMail(user.email, subject, emailContent);

            return res.status(200).json({
                status: true,
                message:
                    "OTP telah berhasil diperbarui. Silakan periksa email Anda untuk OTP yang baru.",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    },

    verifyOtp: async (req, res, next) => {
        try {
            const { id } = req.user
            const { otp } = req.body;


            if (!otp) {
                return res.status(400).json({
                    status: false,
                    message: "OTP diperlukan!",
                    data: null,
                });
            }

            const user = await prisma.user.findUnique({
                where: { id }
            });

            console.log(user)

            if (user.otp !== otp) {
                return res.status(401).json({
                    status: false,
                    message: "OTP tidak valid atau telah kedaluwarsa!",
                    data: null,
                });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    otp: null,
                    otpExpiration: null,
                    updated_at: formatdate(new Date()),
                },
            });


            return res.status(200).json({
                status: true,
                message: "User berhasil diverifikasi",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { emailOrNoTelp, password } = req.body;

            if (!emailOrNoTelp || !password) {
                return res.status(400).json({
                    status: false,
                    message: "Email atau No. Telp dan password harus diisi!",
                    data: null,
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: emailOrNoTelp },
                        { no_telp: emailOrNoTelp }
                    ]
                }
            });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "Email atau nomor telepon tidak valid!",
                    data: null,
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    status: false,
                    message: "Password tidak valid!",
                    data: null,
                });
            }
            if (!user.isVerified) {
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: emailOrNoTelp },
                            { no_telp: emailOrNoTelp }
                        ]
                    }
                })

                const deleteUser = await prisma.user.delete({ where: { id: user.id } })

                return res.status(403).json({
                    status: false,
                    message: "Akun Belum terverifikasi, silahkan register ulang!",
                    data: null,
                });
            }
            delete user.password;
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, { expiresIn: '1d' });

            return res.status(200).json({
                status: true,
                message: "Login berhasil",
                data: { ...user, token },
            });
        } catch (error) {
            next(error);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            const users = await prisma.user.findMany();
            return res.status(200).json({
                status: true,
                message: "Data pengguna berhasil diambil",
                data: users,
            });
        } catch (error) {
            next(error);
        }
    },

    auth: async (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: "OK",
                data: req.user,
            });
        } catch (error) {
            next(error);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            let { email } = req.body;
            const findUser = await prisma.user.findUnique({ where: { email } });

            if (!findUser) {
                return res.status(404).json({
                    status: false,
                    message: "Email tidak ditemukan",
                });
            }
            const token = jwt.sign({ email: findUser.email }, JWT_SECRET_KEY);

            const html = await nodemailer.getHTML("email-reset-password.ejs", {
                name: findUser.name,
                url: `${req.protocol}://${req.get(
                    "host"
                )}/api/v1/reset-password?token=${token}`,
            });

            try {
                await nodemailer.sendMail(email, "Email Forget Password", html);
                return res.status(200).json({
                    status: true,
                    message: "Sukses kirim Email Forget Password",
                });
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "gagal mengirim email",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    verifyResetToken: async (req, res, next) => {
        const { token } = req.query;

        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid or expired token",
                });
            }

            res.status(200).json({
                status: true,
                message: "Token is valid",
                data: { email: decoded.email },
            });
        });
    },

    resetPassword: async (req, res, next) => {
        try {
            let { id } = req.user;
            let { password, confirmPassword } = req.body;

            if (!password || !confirmPassword) {
                return res.status(400).json({
                    status: false,
                    message:
                        "Password dan Konfirmasi password harus diisi",
                    data: null,
                });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: false,
                    message:
                        "Pastikan Password dan konfirmasi Password cocok!",
                    data: null,
                });
            }



            const user = await prisma.user.findUnique({
                where: { email: req.user.email },
                select: { password: true }
            });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "Pengguna tidak ditemukan",
                    data: null,
                });
            }
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                return res.status(400).json({
                    status: false,
                    message: "Password baru tidak boleh sama dengan Password lama!",
                    data: null,
                });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            const updateUser = await prisma.user.update({
                where: { email: req.user.email },
                data: { password: encryptedPassword },
                select: { id: true, email: true, password: true },
            });


            res.status(200).json({
                status: true,
                message: "Berhasil mengatur ulang password pengguna!",
                data: updateUser,
            });

        } catch (err) {
            next(err);
        }
    },

    getuserbyid: async (req, res, next) => {
        try {
            let { id } = req.user
            id = Number(id)
            const user = await prisma.user.findUnique({ where: { id } });

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User tidak ditemukan!",
                    data: null,
                });
            }

            return res.status(200).json({
                status: true,
                message: "Data pengguna berhasil diambil",
                data: { id: user.id, name: user.name, no_telp: user.no_telp, avatar_url: user.avatar_url },
            });

        } catch (error) {
            next(error);
        }
    },

    updateuserbyid: async (req, res, next) => {
        try {
            let { id } = req.user
            let { name, no_telp, password } = req.body
            id = Number(id)
            const user = await prisma.user.findUnique({ where: { id } });

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: "User tidak ditemukan!",
                    data: null,
                });
            }

            if (!name || !no_telp || !password) {
                return res.status(422).json({
                    status: false,
                    message: "field nama, no_telp dan password dibutuhkan!",
                    data: null,
                });
            }

            const noTelpExist = await prisma.user.findUnique({ where: { no_telp } });
            if (noTelpExist) {
                return res.status(400).json({
                    status: false,
                    message: "No. Telp telah digunakan!",
                    data: null,
                });
            }

            // const isSamePassword = await bcrypt.compare(password, user.password);
            // if (isSamePassword) {
            //     return res.status(400).json({
            //         status: false,
            //         message: "New password cannot be the same as the old password!",
            //         data: null,
            //     });
            // }

            let encryptedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await prisma.user.update({ where: { id }, data: { name, no_telp, password: encryptedPassword } })

            return res.status(200).json({
                status: true,
                message: "User profile berhasil diupdate!",
                data: { id: updatedUser.id, name: updatedUser.name, no_telp: updatedUser.no_telp, avatar_url: updatedUser.avatar_url },
            });

        } catch (error) {
            next(error);
        }
    },

    googleOauth2: (req, res) => {
        const { id, name, email, google_id } = req.user;
        const user = {
            id,
            name,
            email,
            password: null,
            google_id
        };
        let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

        return res.status(200).json({
            status: true,
            message: 'Login berhasil',
            err: null,
            data: { user, token }
        });
    }




};