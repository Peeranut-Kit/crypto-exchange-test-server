const express = require("express");
const router = express.Router();

const { getWallets, addWallet } = require("../controllers/wallet");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getWallets).post(protect, addWallet);

module.exports = router;
