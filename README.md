🛒 Full-Stack E-commerce Website
MERN + Razorpay Integrated | Admin Panel + User Panel

A fully functional e-commerce website built using the MERN stack, featuring user authentication, cart management, product listings, admin product management, and secure online payments using Razorpay.

📁 Project Structure
/admin        → Admin dashboard (Add / Remove Products)
/backend      → Node.js + Express + MongoDB + Razorpay payments
/frontend     → User website to browse, add to cart & checkout

🚀 Features
👤 User Features

Login / Signup with JWT authentication

Browse products by category

Add to cart / remove from cart

View cart with quantities

Checkout using Razorpay payment gateway

Mobile-friendly UI

🛠 Admin Features

Add new products

Upload product images

Delete products

Manage all product listings

Admin panel built on Vite

💳 Payments

Razorpay test mode integrated

Create orders from backend

Amount verification

Secure payment popup

🗄 Backend Features

Secure API routes

JWT-based protected routes

MongoDB + Mongoose models

Image uploading using multer

Cart stored per user

🔧 Installation & Setup
1. Backend
cd backend
npm install
npm start


Create a .env file:

MONGO_URI=your_connection_string
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
JWT_SECRET=your_secret

2. Frontend
cd frontend
npm install
npm run dev

3. Admin
cd admin
npm install
npm run dev

📦 Tech Stack

Frontend: React, Vite, Context API
Backend: Node.js, Express.js, JWT, Multer
Database: MongoDB + Mongoose
Payments: Razorpay
Storage: Local uploads folder

📸 Screenshots

(Add screenshots later)

📄 License

This project is open-source and free to use.
