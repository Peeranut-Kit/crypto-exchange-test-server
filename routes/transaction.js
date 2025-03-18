const express = require("express");
const router = express.Router();

const {
  getTransactions,
  createTransaction,
} = require("../controllers/transaction");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

module.exports = router;
