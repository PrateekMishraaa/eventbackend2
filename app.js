const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const router = require("./routes/registration");

dotenv.config();

const app = express();


const allowedOrigins = [
 "http://localhost:5000/",
//  "http://157.173.222.125:6001",
//  "http://157.173.222.125:6000/",
//  "http://157.173.222.125:6001/",
 
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



// app.use(cors()); 
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get("/",(req,res)=>{
  console.log("hello world")
  res.send("hello pandit ji")
})

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api", router);

const registerRoutePoster = require("./routes/registerRoutePoster");
app.use("/api/poster", registerRoutePoster);

const registrationRoutes = require("./routes/registration");  
app.use("/api", registrationRoutes);

const bulkRegisterRoute = require("./routes/bulkRegister");

app.use("/api/bulk-register", bulkRegisterRoute);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})

.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Mongo error:", err));

console.log("mongouri",process.env.MONGO_URI)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
