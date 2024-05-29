const express = require("express");
const router = express.Router();

const {
  getAllSeatClasses,
  createSeatClass,
} = require("../../controllers/seatclass.controller");

router.get("/seatclasses", getAllSeatClasses);
router.post("/seatclasses", createSeatClass);

module.exports = router;
