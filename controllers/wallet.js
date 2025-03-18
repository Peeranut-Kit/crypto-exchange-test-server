const Wallet = require("../models/wallet");

exports.getWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ userId: req.user.id })
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
      count: wallets.length,
      data: wallets,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addWallet = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    // Check for existed wallet
    const existedWallet = await Wallet.findOne({
      userId: req.user.id,
      currencyId: req.body.currencyId,
    });

    if (existedWallet) {
      return res.status(409).json({
        success: false,
        message: `This user already has this currency wallet.`,
      });
    }

    const wallet = await Wallet.create(req.body);
    res.status(201).json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
