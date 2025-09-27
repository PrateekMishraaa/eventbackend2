const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const Registration = require("../models/Registration");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/excel");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowed = [".xlsx", ".xls",".csv"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only Excel files are allowed!"));
  },
});

// ✅ Route: Upload and parse Excel file
router.post("/bulk-register-excel", upload.single("excelFile"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log(filePath);

    // ✅ Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!Array.isArray(sheetData) || sheetData.length === 0) {
      return res.status(400).json({ success: false, message: "Excel file is empty or invalid" });
    }

    // Optional: clean/transform data before saving

    // ✅ Insert into MongoDB
    const result = await Registration.insertMany(sheetData, { ordered: false });

    // ✅ Clean up file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "Excel bulk registration successful",
      insertedCount: result.length,
    });
  } catch (err) {
    console.error("❌ Excel upload error:", err);
    res.status(500).json({
      success: false,
      message: "Excel upload failed",
      error: err.message,
    });
  }
});

module.exports = router;
