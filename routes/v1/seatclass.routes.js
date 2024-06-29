const express = require("express");
const router = express.Router();

const {
  getAllSeatClasses,
  createSeatClass,
} = require("../../controllers/seatclass.controller");
const { restrict } = require("../../middlewares/auth.middleware");

router.get("/seatclasses", getAllSeatClasses);
router.post("/seatclasses", restrict, createSeatClass);

module.exports = router;
