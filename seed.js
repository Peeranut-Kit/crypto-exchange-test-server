const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");
const Currency = require("./models/currency");
const Wallet = require("./models/wallet");
const Order = require("./models/order");
const Transaction = require("./models/transaction");

dotenv.config();

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabase");
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log("Start seeding...");

    await connectDB();

    console.log("Connected to MongoDB successfully.");

    // Clear existing data
    await User.deleteMany();
    console.log("Old users deleted...");
    await Currency.deleteMany();
    console.log("Old currencies deleted...");
    await Wallet.deleteMany();
    console.log("Old wallets deleted...");
    await Order.deleteMany();
    console.log("Old orders deleted...");
    await Transaction.deleteMany();
    console.log("Old transactions deleted...");

    console.log("All old data deleted...");

    // Create Users
    const users = await User.create([
      {
        username: "Steve Rogers",
        email: "steve@example.com",
        password: "123456",
      },
      {
        username: "Tony Stark",
        email: "tony@example.com",
        password: "123456789",
      },
    ]);

    // Create Currency
    const currencies = await Currency.create([
      {
        name: "BTC",
        symbol: "BTC",
      },
      {
        name: "ETH",
        symbol: "ETH",
      },
      {
        name: "DOGE",
        symbol: "DOGE",
      },
      {
        name: "XRP",
        symbol: "XRP",
      },
    ]);

    // Create Wallets
    const wallets = await Wallet.create([
      {
        userId: users[0]._id,
        currencyId: currencies[0]._id,
        balance: 50,
      },
      {
        userId: users[1]._id,
        currencyId: currencies[0]._id,
        balance: 100,
      },
      {
        userId: users[1]._id,
        currencyId: currencies[1]._id,
        balance: 40,
      },
      {
        userId: users[1]._id,
        currencyId: currencies[2]._id,
      },
    ]);

    // Create Orders
    const orders = await Order.create([
      {
        userId: users[0]._id,
        currencyId: currencies[0]._id,
        orderType: "SELL",
        fiatCurrency: "USD",
        pricePerUnit: 83164.07,
        amount: 2,
        status: "PENDING",
      },
      {
        userId: users[1]._id,
        currencyId: currencies[0]._id,
        orderType: "SELL",
        fiatCurrency: "USD",
        pricePerUnit: 83164.07,
        amount: 20,
        status: "PENDING",
      },
    ]);

    // Create Transactions
    await Transaction.create([
      {
        senderWalletId: wallets[0]._id,
        receiverWalletId: wallets[1]._id,
        currencyId: wallets[0].currencyId,
        amount: 10,
        txHash: "tx123456",
        status: "PENDING",
      },
    ]);

    console.log("Seeding complete...");
    process.exit(); // Exit script
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run the function
seedData();
