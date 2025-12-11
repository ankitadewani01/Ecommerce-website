const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

app.use(express.json());
app.use(cors());

// ---------------- Razorpay Initialization ----------------
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",       // Replace with your Razorpay test key
  key_secret: "YOUR_KEY_SECRET" // Replace with your Razorpay test secret
});

// ---------------- Database Connection ----------------
mongoose
  .connect(
    "mongodb+srv://ankitadewani01_db_user:5AmCL4J4MgRWcdLI@cluster0.bmd18he.mongodb.net/e-commerce"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- API creation ----------------
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// ---------------- Image Storage Engine ----------------
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });
app.use("/images", express.static("upload/images"));

// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// ---------------- Schemas ----------------
const Product = mongoose.model("Product", {
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const User = mongoose.model("users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// ---------------- Middleware ----------------
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

// ---------------- Signup & Login ----------------
app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check)
    return res.status(400).json({
      success: false,
      errors: "Existing user found with same email address",
    });

  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ success: false, errors: "User not found" });
  if (req.body.password !== user.password) return res.status(400).json({ success: false, errors: "Wrong password" });

  const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
  res.json({ success: true, token });
});

// ---------------- Products APIs ----------------
app.post("/addproduct", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});

app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);
    res.json({ success: true, id: req.body.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error removing product" });
  }
});

app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// ---------------- Cart APIs ----------------
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await User.findById(req.user.id);
  userData.cartData[req.body.itemId] += 1;
  await User.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await User.findById(req.user.id);
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await User.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
  res.send("Removed");
});

app.post("/getcart", fetchUser, async (req, res) => {
  let userdata = await User.findById(req.user.id);
  res.json(userdata.cartData);
});

// ---------------- Razorpay Create Order ----------------
app.post("/create-order", fetchUser, async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const options = {
      amount: totalAmount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});

// ---------------- Start Server ----------------
app.listen(port, () => {
  console.log("✅ Server running on Port " + port);
});
