const express = require("express");
const router = express.Router();
const User = require("./user.routes");
const Airline = require("./airlines.routes");
const SeatClass = require("./seatclass.routes");
const flight = require("./flights.routes");
const Airport = require("./airport.routes");
const Promotion = require("./promotion.route")
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const swagger_path = path.resolve(__dirname, "../../docs/openapi.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

router.use("/api/v1", User, Airline, SeatClass, flight, Airport, Promotion);


module.exports = router