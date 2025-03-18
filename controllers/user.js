const User = require("../models/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log({ username, email, password });
    const hashPassword = await argon2.hash(password);
    //Create user
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    console.log("User created:", user);
    //Create token to cookie and send response
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      return res
        .status(401)
        .json({ success: false, msg: "Please provide an email and password" });
    }
    //Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }
    //Check if password matches
    if (await argon2.verify(user.password, password)) {
      //Create token to cookie and send response
      sendTokenResponse(user, 200, res);
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: err.message,
    });
  }
};

const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = getSignedJwtToken(user._id);

  res.status(statusCode).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
    cookie: {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    succuss: true,
    data: user,
  });
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};
