const express = require("express");
const router = express.Router();
const seatClassController = require("../../controllers/seatclass.controller");

router.get("/seatclasses", seatClassController.getAllSeatClasses);
router.get("/seatclasses/:id", seatClassController.getSeatClassById);
router.post("/seatclasses", seatClassController.createSeatClass);

module.exports = router;
