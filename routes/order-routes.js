const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const Auth = require("../middleware/auth");

const {
  createOrder,
  getOrderByUserId,
  getOrderById,
  getAllOrders,
  deleteOrder,
  updateOrder,
} = require("../controllers/order-controller");

router.get("/", getAllOrders);
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
router.get("/user/:userId", getOrderByUserId);
router.get("/:orderId", getOrderById);
router.patch(
  "/:orderId",
  [
    check("name").not().isEmpty(),
    check("phone").isLength({ min: 10 }),
    check("email").normalizeEmail().isEmail(),
  ],
  updateOrder
);
router.delete("/:OrderId", deleteOrder);
module.exports = router;
