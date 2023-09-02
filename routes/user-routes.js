const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const Auth = require("../middleware/auth");
const router = express.Router();

const {
  signup,
  login,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
} = require("../controllers/user-controller");

router.post(
  "/signup",
  fileUpload.single("image"),

  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.use(Auth);
router.patch(
  "/",
  [
    check("name").not().isEmpty(),
    check("phone").isLength({ min: 10 }),
    check("email").normalizeEmail().isEmail(),
  ],
  updateUser
);
router.delete("/", deleteUser);

module.exports = router;
