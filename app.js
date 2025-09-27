// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// --------------------- CORS Setup ---------------------
const allowedOrigins = [
  "https://eventbackend-alpha.vercel.app", // frontend URL
  // "http://localhost:3000", // uncomment during local dev if needed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// --------------------- Middleware ---------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --------------------- Routes ---------------------
// Test route
app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Hello Pandit Ji");
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Registration routes
const registrationRoutes = require("./routes/registration");
app.use("/api", registrationRoutes);

// Poster registration routes
const registerRoutePoster = require("./routes/registerRoutePoster");
app.use("/api/poster", registerRoutePoster);

// Bulk registration routes
const bulkRegisterRoute = require("./routes/bulkRegister");
app.use("/api/bulk-register", bulkRegisterRoute);

// --------------------- MongoDB Connection ---------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

console.log("Mongo URI:", process.env.MONGO_URI);

// --------------------- Start Server ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
