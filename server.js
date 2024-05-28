const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route to set a cookie
app.post("/set-cookie", (req, res) => {
  return res
    .status(200)
    .cookie("god", "SACHIN TENDULKAR", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Set this to 'None' if using cross-site cookies
      maxAge: 3600000, // 1 hour
    })
    .json({
      message: "Cookie set successfully",
    });
});

// Route to read a cookie
app.get("/read-cookie", (req, res) => {
  console.log("Cookie Data = ", req.cookies);
  const cookieValue = req.cookies["god"];
  return res.status(200).json({
    message: `Cookie value is ${cookieValue}`,
  });
});

// Route to clear a cookie
app.delete("/clear-cookie", (req, res) => {
  return res
    .status(200)
    .clearCookie("god", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Ensure this matches your set-cookie settings
      // expires: new Date(0),
    })
    .json({
      message: "Cookie cleared successfully",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`c7 = Server running on port ${PORT}`));
