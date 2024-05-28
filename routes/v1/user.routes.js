const router = require("express").Router();
const { image } = require('../../libs/multer');
const { register, login, auth, forgotPassword, resetPassword, getAllUsers, renewOTP, verifyOtp, verifyResetToken, getuserbyid, updateuserbyid , googleOauth2} = require('../../controllers/user.controller');
const { restrict } = require("../../middlewares/auth.middleware");
const { uploadAvatar } = require("../../controllers/media.controllers");
const passport = require('../../libs/passport');

router.post('/register', register)
router.post('/login', login)
router.get('/all-user', getAllUsers)
router.get('/auth', restrict, auth)
router.get('/profile', restrict, getuserbyid)
router.post('/updateprofile', restrict, updateuserbyid)
router.post('/uploadavatar', image.single('file'), uploadAvatar)

router.post("/renew-otp", renewOTP);
router.post("/verify-otp", restrict, verifyOtp);

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', restrict, resetPassword)
router.get('/reset-password', verifyResetToken)

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/v1/google',
        session: false
    }),
    googleOauth2
);


module.exports = router