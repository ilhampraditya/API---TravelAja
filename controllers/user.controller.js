require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { JWT_SECRET_KEY } = process.env;
const {formatdate} = require('../libs/formatdate')
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
            const emailToken = crypto.randomBytes(16).toString("hex");

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    no_telp,
                    password: encryptedPassword,
                    otp,
                    otpExpiration,
                    email_token: emailToken,
                    role: "user",
                    isVerified: false,
                    created_at: formatdate(new Date()),
                    updated_at: formatdate(new Date()),
                },
            });

            const subject = "Verifikasi OTP";

            const emailContent = await getHTML("otp-email.ejs", { otp });

            await sendMail(user.email, subject, emailContent);

            return res.status(201).json({
                status: true,
                message:
                    "User telah berhasil terdaftar. Silakan periksa email Anda untuk OTP.",
                data: { verifId: emailToken, verifEmail: user.email },
            });
        } catch (error) {
            next(error);
        }
    },

    verifyOtpGet: async (req, res, next) => {
        try {
            const { verification } = req.params;

            if (!verification) {
                return res.status(400).json({
                    status: false,
                    message: "Token verifikasi diperlukan!",
                    data: null,
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    email_token: verification,
                },
            });

            if (!user) {
                return res.status(500).json({
                    status: false,
                    message: "Token verifikasi tidak valid",
                    data: null,
                });
            }

            if (new Date() > new Date(user.otpExpiration)) {
                return res.status(401).json({
                    status: false,
                    message: "OTP telah kedaluwarsa!",
                    data: null,
                });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    otp: null,
                    otpExpiration: null,
                    email_token: null,
                    updated_at: formatdate(new Date()),
                },
            });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET_KEY,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                status: true,
                message: "User berhasil diverifikasi",
                data: { token },
            });
        } catch (error) {
            next(error);
        }
    },

    renewOTP: async (req, res, next) => {
        try {
            const { verification } = req.params;
            const { email } = req.body;

            // Cari pengguna berdasarkan token verifikasi
            const user = await prisma.user.findFirst({
                where: { email_token: verification },
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
                    email_token: newEmailToken,
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
                data: { newEmailToken },
            });
        } catch (error) {
            next(error);
        }
    },

    verifyOtp: async (req, res, next) => {
        try {
            const { otp } = req.body;
            const { verification } = req.params;

            if (!otp || !verification) {
                return res.status(400).json({
                    status: false,
                    message: "OTP dan verification diperlukan!",
                    data: null,
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    email_token: verification,
                },
            });

            if (!user) {
                return res.status(500).json({
                    status: false,
                    message: "Parameter verifikasi tidak valid",
                    data: null,
                });
            }

            if (user.otp !== otp || new Date() > new Date(user.otpExpiration)) {
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
                    email_token: null,
                    updated_at: formatdate(new Date()),
                },
            });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET_KEY,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                status: true,
                message: "User berhasil diverifikasi",
                data: { token },
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
                    message: "Email or No. Telp and password are required!",
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
                return res.status(400).json({
                    status: false,
                    message: "Invalid email or no. telp or password!",
                    data: null,
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid email or no. telp or password!",
                    data: null,
                });
            }

            delete user.password;
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, { expiresIn: '1d' });

            return res.status(200).json({
                status: true,
                message: "Login successful",
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
                message: "User data retrieved successfully",
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
                    message: "Email not found",
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
                    message: "Success Send Email Forget Password",
                });
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Failed to send email",
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
            let { token } = req.query;
            let { password, confirmPassword } = req.body;

            if (!password || !confirmPassword) {
                return res.status(400).json({
                    status: false,
                    message:
                        "Password and Password confirmation must be required",
                    data: null,
                });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: false,
                    message:
                        "Please ensure that the password and password confirmation match!",
                    data: null,
                });
            }


            jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(400).json({
                        status: false,
                        message: "Bad request",
                        err: err.message,
                        data: null,
                    });
                }

                const user = await prisma.user.findUnique({
                    where: { email: decoded.email },
                    select: { password: true }
                });

                if (!user) {
                    return res.status(404).json({
                        status: false,
                        message: "User not found",
                        data: null,
                    });
                }
                const isSamePassword = await bcrypt.compare(password, user.password);
                if (isSamePassword) {
                    return res.status(400).json({
                        status: false,
                        message: "New password cannot be the same as the old password!",
                        data: null,
                    });
                }

                let encryptedPassword = await bcrypt.hash(password, 10);
                const updateUser = await prisma.user.update({
                    where: { email: decoded.email },
                    data: { password: encryptedPassword },
                    select: { id: true, email: true, password:true },
                });


                res.status(200).json({
                    status: true,
                    message: "Reset user password successfully!",
                    data: updateUser,
                });
            });
        } catch (err) {
            next(err);
        }
    },

   

    
};