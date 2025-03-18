const Currency = require("../models/currency");

exports.getCurrencies = async (req, res, next) => {
  try {
    const currencies = await Currency.find();

    res.status(200).json({
      success: true,
      count: currencies.length,
      data: currencies,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addCurrency = async (req, res, next) => {
  try {
    const currency = await Currency.create(req.body);
    res.status(201).json({ success: true, data: currency });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
