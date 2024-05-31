const express = require("express");
const { createPassenger, getAllPassenger, getAllByToken } = require("../../controllers/passenger.controllers");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();


router.post("/passenger", restrict, createPassenger);
router.get("/passenger",  getAllPassenger);
router.get("/passenger/token", restrict, getAllByToken);


module.exports = router;
