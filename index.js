const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

//Route files
const userRouter = require("./routes/user");
const currencyRouter = require("./routes/currency");
const walletRouter = require("./routes/wallet");
const orderRouter = require("./routes/order");
const transactionRouter = require("./routes/transaction");

dotenv.config();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/currency", currencyRouter);
app.use("/api/v1/wallets", walletRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/transactions", transactionRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
