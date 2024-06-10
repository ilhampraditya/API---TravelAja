const express = require("express");

const { restrict } = require("../../middlewares/auth.middleware");

const { createTicket, getTicketByBookingCode } = require("../../controllers/ticket.controller");
const router = express.Router();

router.get("/get-ticket/:booking_code", restrict, getTicketByBookingCode);

router.post("/create-ticket", createTicket);

module.exports = router;
