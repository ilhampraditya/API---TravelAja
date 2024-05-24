const express = require("express");
const router = express.Router();
const User = require("../v1/user.route")

router.use("/api/v1", User);


module.exports = router