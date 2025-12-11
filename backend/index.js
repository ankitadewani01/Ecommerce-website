// index.js (SAFE VERSION)

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ----------------------
// 1. MongoDB Connection
// ----------------------
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ----------------------
// 2. Razorpay Connection
// ----------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ----------------------
// 3. Multer for Image Upload
// ----------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ----------------------
// 4. Sample Product Schema
// ----------------------
const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  image: String,
});

// ----------------------
// 5. Add Product (Admin)
// ----------------------
app.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.file.filename,
    });

    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ----------------------
// 6. Get All Products
// ----------------------
app.get("/allproducts", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ----------------------
// 7. JWT Auth Example
// ----------------------
app.post("/login", (req, res) => {
  const userData = { email: req.body.email };

  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ success: true, token });
});

// ----------------------
// 8. Create Razorpay Order
// ----------------------
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// ----------------------
// 9. Start Server
// ----------------------
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
