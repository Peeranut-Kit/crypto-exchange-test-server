const Order = require("../models/order");
const Wallet = require("../models/wallet");
const Currency = require("../models/currency");

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: "userId",
        select: "username email",
      })
      .populate({
        path: "currencyId",
        select: "name symbol",
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const orderCurrencyId = req.body.currencyId;
    const userId = req.user.id;
    const orderAmount = req.body.amount;
    const orderType = req.body.orderType;

    // Check if the user has a wallet with the given currencyId
    const userWallet = await Wallet.findOne({
      userId,
      currencyId: orderCurrencyId,
    });
    const currency = await Currency.findById(orderCurrencyId);

    if (!userWallet) {
      return res.status(400).json({
        success: false,
        message: `User does not have a wallet for currency: ${
          currency ? currency.name : "Unknown"
        }`,
      });
    }

    // Check if the user has enough wallet to sell
    if (orderType === "SELL" && userWallet.balance < orderAmount) {
      return res.status(400).json({
        success: false,
        message: `User does not have enough ${currency.name} to sell. Available: ${userWallet.balance}, Required: ${orderAmount}`,
      });
    }

    // Create the order
    req.body.userId = userId;
    const order = await Order.create(req.body);

    // If SELL order, deduct balance from the wallet
    if (orderType === "SELL") {
      await Wallet.updateOne(
        { userId, currencyId: orderCurrencyId },
        { $inc: { balance: -orderAmount } }
      );
    }
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
