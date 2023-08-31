const express = require("express");

const router = express.Router();

const { signup } = require("../controllers/user-controller");

router.get("/", signup);

module.exports = router;
