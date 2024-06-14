const router = require("express").Router();
const { image } = require("../../libs/multer");
const {
  getAllAirlines,
  createAirline,
  updateAirline,
  deleteAirline,
} = require("../../controllers/airlines.controllers");

router.get("/airlines", getAllAirlines);
router.post("/airlines", image.single("file"), createAirline);
router.put("/airlines/:airline_id", image.single("file"), updateAirline);
router.delete("/airlines/:airline_id", deleteAirline);

module.exports = router;
