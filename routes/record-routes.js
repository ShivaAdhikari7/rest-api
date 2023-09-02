const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const Auth = require("../middleware/auth");

const {
  createRecord,
  getRecordByUserId,
  getRecordById,
  getAllRecords,
  deleteRecord,
  updateRecord,
} = require("../controllers/record-controller");

router.get("/", getAllRecords);
router.use(Auth);
router.post(
  "/",

  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").not().isEmpty().isLength({ min: 10 }),
  ],
  createRecord
);
router.get("/user/:userId", getRecordByUserId);
router.get("/:recordId", getRecordById);
router.patch(
  "/:recordId",
  [
    check("name").not().isEmpty(),
    check("phone").isLength({ min: 10 }),
    check("email").normalizeEmail().isEmail(),
  ],
  updateRecord
);
router.delete("/:recordId", deleteRecord);
module.exports = router;
