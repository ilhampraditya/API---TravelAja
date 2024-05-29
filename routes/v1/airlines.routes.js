const router = require("express").Router();
const {
  getAllAirlines,
  createAirline,
} = require("../../controllers/airlines.controllers");

router.get("/airlines", getAllAirlines);
router.post("/airlines", createAirline);

module.exports = router;
