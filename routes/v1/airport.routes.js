const router = require("express").Router();
const {
  createAirport,
  getAllAirports,
  editAirportById,
  getAirportById,
} = require("../../controllers/airport.controller");
const { restrict } = require("../../middlewares/auth.middleware");

router.post("/airport", restrict, createAirport);
router.get("/airport", getAllAirports);
router.get("/airport/:airportId", getAirportById);
router.put("/airport/:airportId", restrict, editAirportById);


module.exports = router;
