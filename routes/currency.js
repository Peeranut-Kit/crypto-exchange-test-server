const express = require("express");
const router = express.Router();

const { getCurrencies, addCurrency } = require("../controllers/currency");

router.route("/").get(getCurrencies).post(addCurrency);

module.exports = router;
