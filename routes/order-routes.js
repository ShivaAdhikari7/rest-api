const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const Auth = require("../middleware/auth");

const { createOrder } = require("../controllers/order-controller");

router.use(Auth);
router.post(
  "/",

  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").not().isEmpty().isLength({ min: 10 }),
  ],
  createOrder
);
module.exports = router;
