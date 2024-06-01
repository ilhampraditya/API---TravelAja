const express = require("express");
const { getAllPassenger, createPassenger } = require("../../controllers/passenger.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.get("/passenger", getAllPassenger);
router.post("/passenger", restrict, createPassenger);

module.exports = router;
