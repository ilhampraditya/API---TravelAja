const express = require("express");
const { restrict } = require("../../middlewares/auth.middleware");
const { createTicket, getTicketByBookingCode } = require("../../controllers/ticket.controller");
const router = express.Router();


router.get("/ticket/:booking_code", restrict, getTicketByBookingCode);
router.post("/ticket", createTicket);

module.exports = router;
