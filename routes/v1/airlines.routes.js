const router = require("express").Router();
const { image } = require("../../libs/multer");
const {
  getAllAirlines,
  createAirline,
} = require("../../controllers/airlines.controllers");

router.get("/airlines", getAllAirlines);
router.post("/airlines", image.single("file"), createAirline);

module.exports = router;
