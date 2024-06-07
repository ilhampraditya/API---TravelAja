const express = require("express");
const { createTicket, getTicketByBookingCode } = require("../../controllers/ticket.controller");
const router = express.Router();


router.get("/get-ticket/:booking_code", getTicketByBookingCode);
router.post("/create-ticket", createTicket);

module.exports = router;
