const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  senderWalletId: {
    type: mongoose.Schema.ObjectId,
    ref: "Wallet",
    required: true,
  },
  receiverWalletId: {
    type: mongoose.Schema.ObjectId,
    ref: "Wallet",
  },
  externalAddress: {
    type: String,
  },
  currencyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  txHash: {
    type: String,
    requied: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
