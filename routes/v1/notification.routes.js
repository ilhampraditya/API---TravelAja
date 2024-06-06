const express = require("express");
const {  getAllNotification, getNotificationById } = require("../../controllers/notification.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.get("/notification", getAllNotification);
router.get("/notification-user", restrict, getNotificationById);

module.exports = router;