const express = require("express");
const {
  createPassenger,
  getAllPassenger,
  getByToken,
} = require("../../controllers/passenger.controllers");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.post("/passenger", restrict, createPassenger);
router.get("/passenger", getAllPassenger);
router.get("/passenger-token", restrict, getByToken);

module.exports = router;
