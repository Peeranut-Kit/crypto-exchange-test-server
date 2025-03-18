const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");

exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wallets = await Wallet.find({ userId: userId });
    const ownWalletIds = wallets.map((wallet) => wallet._id);

    const transactions = await Transaction.find({
      $or: [
        { senderWalletId: { $in: ownWalletIds } },
        { receiverWalletId: { $in: ownWalletIds } },
      ],
    }).populate("senderWalletId receiverWalletId currencyId");

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { receiverWalletId, currencyId, amount, type } = req.body;

    // Ensure sender has a wallet for the specified currency
    const senderWallet = await Wallet.findOne({
      userId: userId,
      currencyId,
    });
    if (!senderWallet) {
      return res.status(400).json({
        success: false,
        message: `Sender does not have a wallet for this currency.`,
      });
    }

    // Ensure that sender and receiver is not the same wallet
    const senderWalletId = senderWallet._id;
    if (senderWalletId === receiverWalletId) {
      return res.status(400).json({
        success: false,
        message: `Receiver and sender cannot be the same wallet.`,
      });
    }

    // Check sender balance
    if (senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${senderWallet.balance}, Required: ${amount}`,
      });
    }

    // If transferring within the system, ensure recipient has a wallet
    let recipientWallet = null;
    if (type === "INTERNAL") {
      recipientWallet = await Wallet.findOne({
        userId: receiverWalletId,
        currencyId,
      });
      if (!recipientWallet) {
        return res.status(400).json({
          success: false,
          message: `Recipient does not have a wallet for this currency.`,
        });
      }
    }

    // Create the transaction record
    req.body.senderWalletId = senderWalletId;
    const transaction = await Transaction.create(req.body);

    // Deduct from sender if it's a transfer or withdrawal
    await Wallet.findByIdAndUpdate(
      senderWalletId,
      { $inc: { balance: -amount } },
      { new: true }
    );

    // If the transaction type is INTERNAL, add amount to recipient wallet
    if (type === "INTERNAL") {
      await Wallet.findByIdAndUpdate(
        receiverWalletId,
        { $inc: { balance: amount } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
