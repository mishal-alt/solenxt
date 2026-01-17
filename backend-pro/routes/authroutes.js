const express = require("express");
const router = express.Router();
const { loginUser, refreshAccessToken } = require("../controllers/authcontroller");

router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

module.exports = router;
