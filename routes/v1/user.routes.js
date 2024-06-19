const router = require("express").Router();
const { image } = require("../../libs/multer");
const {
  register,
  login,
  auth,
  forgotPassword,
  resetPassword,
  getAllUsers,
  renewOTP,
  verifyOtp,
  verifyResetToken,
  getuserbyid,
  updateuserbyid,
  googleOauth2,
  changePassword,
} = require("../../controllers/user.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const { uploadAvatar } = require("../../controllers/media.controllers");
const passport = require("../../libs/passport");

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user", restrict, getAllUsers);
router.get("/user/auth", restrict, auth);
router.get("/user/profile", restrict, getuserbyid);
router.post("/user/updateprofile", restrict, updateuserbyid);
router.post("/user/uploadavatar", restrict, image.single("file"), uploadAvatar);

router.post("/user/otp/renew", renewOTP);
router.post("/user/otp/verify", restrict, verifyOtp);

router.post("/user/password/forgot", forgotPassword);
router.post("/user/password/reset", restrict, resetPassword);
router.get("/user/password/reset", verifyResetToken);
router.put("/user/password/change", restrict, changePassword)

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/google",
    session: false,
  }),
  googleOauth2
);

module.exports = router;
