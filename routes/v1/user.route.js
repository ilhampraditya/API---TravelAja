const router = require("express").Router();

const {register, login, auth, forgotPassword, resetPassword, getAllUsers, renewOTP, verifyOtp, verifyOtpGet, verifyResetToken}= require('../../controllers/user.controller');
const { restrict } = require("../../middlewares/auth.middleware");



router.post('/register', register)
router.post('/login', login)
router.get('/all-user', getAllUsers)
router.get('/auth', restrict, auth)

router.post("/renew-otp",renewOTP);
router.post("/verify-otp/:verification", verifyOtp);
router.get("/verify-otp/:verification", verifyOtpGet);

router.post('/forgot-password', forgotPassword )
router.post('/reset-password', resetPassword)
router.get('/reset-password', verifyResetToken)



module.exports = router