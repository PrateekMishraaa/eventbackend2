const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Registration = require("../models/Registration");
const {
  registerController,
  getAllRegistrationsData,
  getRegistrationByID,
  getSchoolByUdiseCode,
  updateEmailAndNumberById,
  getDataByDistrict
} = require("../controllers/registerController");

const router = express.Router();

// Create folders if they don't exist
const imagePath = path.join(__dirname, "../uploads/images");
const videoPath = path.join(__dirname, "../uploads/videos");
const docPath = path.join(__dirname, "../uploads/docs");

[imagePath, videoPath, docPath].forEach((p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, imagePath);
    else if (file.mimetype.startsWith("video/")) cb(null, videoPath);
    else cb(null, docPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Helper functions to generate accessible URLs
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const getFilePaths = (arr, type) =>
  arr?.map(f => `${BASE_URL}/uploads/${type}/${f.filename}`) || [];

const getSingleFilePath = (arr, type) =>
  arr?.[0] ? `${BASE_URL}/uploads/${type}/${arr[0].filename}` : null;

// POST /register
router.post(
  "/register",
  upload.fields([
    { name: "uploadImage", maxCount: 10 },
    { name: "uploadVideo", maxCount: 5 },
    { name: "uploadLetter", maxCount: 1 },
    { name: "sdmcFile", maxCount: 1 },
    { name: "riFile", maxCount: 1 },
    { name: "mapFile", maxCount: 1 },
    { name: "fireDrillFile", maxCount: 1 },
    { name: "earthquakeDrillFile", maxCount: 1 },
    { name: "heatwaveDrillFile", maxCount: 1 },
    { name: "regionDisasterDrillFile", maxCount: 1 },
    { name: "urbanFloodDrillFile", maxCount: 1 },
    { name: "otherDrillFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { email, gps, ...formData } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }

      // Required fields
      const requiredFields = [
        "schoolName",
        "teacherName",
        "teacherContact",
        "schoolType",
        "state",
        "district",
        "block",
        "udiseCode",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Required fields missing: ${missingFields.join(", ")}`,
        });
      }

      const files = req.files;

      // Map files to URLs
      const uploadImage = getFilePaths(files?.uploadImage, "images");
      const uploadVideo = getFilePaths(files?.uploadVideo, "videos");
      const uploadLetter = getSingleFilePath(files?.uploadLetter, "docs");

      const sdmcFile = getSingleFilePath(files?.sdmcFile, "docs");
      const riFile = getSingleFilePath(files?.riFile, "docs");
      const mapFile = getSingleFilePath(files?.mapFile, "docs");
      const fireDrillFile = getSingleFilePath(files?.fireDrillFile, "docs");
      const earthquakeDrillFile = getSingleFilePath(files?.earthquakeDrillFile, "docs");
      const heatwaveDrillFile = getSingleFilePath(files?.heatwaveDrillFile, "docs");
      const regionDisasterDrillFile = getSingleFilePath(files?.regionDisasterDrillFile, "docs");
      const urbanFloodDrillFile = getSingleFilePath(files?.urbanFloodDrillFile, "docs");
      const otherDrillFile = getSingleFilePath(files?.otherDrillFile, "docs");

      // GPS parsing
      let gpsData = {};
      if (gps) {
        if (typeof gps === "string") {
          try { gpsData = JSON.parse(gps); } catch(e) { console.warn("Invalid GPS string:", gps); }
        } else if (typeof gps === "object") { gpsData = gps; }
      }

      // Helper functions
      const parseIntSafe = val => { const n = parseInt(val); return isNaN(n) ? 0 : Math.max(0, n); };
      const parseCountSafe = val => { const n = parseInt(val); return isNaN(n) ? 0 : Math.max(0, Math.min(2, n)); };
      const parseDate = val => { const d = new Date(val); return val && !isNaN(d.getTime()) ? d : null; };

      // Build registration data
      const newData = {
        schoolName: formData.schoolName?.trim() || "",
        teacherName: formData.teacherName?.trim() || "",
        teacherContact: formData.teacherContact?.trim() || "",
        email: email.trim(),
        schoolType: formData.schoolType || "Other",
        state: formData.state || "",
        district: formData.district || "",
        block: formData.block || "",
        udiseCode: formData.udiseCode?.trim() || "",
        totalStudentsMale: parseIntSafe(formData.totalStudentsMale),
        totalStudentsFemale: parseIntSafe(formData.totalStudentsFemale),
        trainedStudentsMale: parseIntSafe(formData.trainedStudentsMale),
        trainedStudentsFemale: parseIntSafe(formData.trainedStudentsFemale),
        trainedDisabledStudentsMale: parseIntSafe(formData.trainedDisabledStudentsMale),
        trainedDisabledStudentsFemale: parseIntSafe(formData.trainedDisabledStudentsFemale),
        totalTeachersMale: parseIntSafe(formData.totalTeachersMale),
        totalTeachersFemale: parseIntSafe(formData.totalTeachersFemale),
        trainedTeachersMale: parseIntSafe(formData.trainedTeachersMale),
        trainedTeachersFemale: parseIntSafe(formData.trainedTeachersFemale),
        trainedDisabledTeachersMale: parseIntSafe(formData.trainedDisabledTeachersMale),
        trainedDisabledTeachersFemale: parseIntSafe(formData.trainedDisabledTeachersFemale),
        hasDMPlan: formData.hasDMPlan || "no",
        rapidSurvay: formData.rapidSurvay || "no",
        hasDrill: formData.hasDrill || "no",
        fireDrillConducted: formData.fireDrillConducted || "no",
        fireDrillCount: parseCountSafe(formData.fireDrillCount),
        fireDrillLastDate: parseDate(formData.fireDrillLastDate),
        fireDrillFile,
        earthquakeDrillConducted: formData.earthquakeDrillConducted || "no",
        earthquakeDrillCount: parseCountSafe(formData.earthquakeDrillCount),
        earthquakeDrillLastDate: parseDate(formData.earthquakeDrillLastDate),
        earthquakeDrillFile,
        heatwaveDrillConducted: formData.heatwaveDrillConducted || "no",
        heatwaveDrillCount: parseCountSafe(formData.heatwaveDrillCount),
        heatwaveDrillLastDate: parseDate(formData.heatwaveDrillLastDate),
        heatwaveDrillFile,
        regionaldisasterDrillConducted: formData.regionaldisasterDrillConducted || "no",
        regionaldisasterDrillCount: parseCountSafe(formData.regionaldisasterDrillCount),
        regionaldisasterDrillLastDate: parseDate(formData.regionaldisasterDrillLastDate),
        regionDisasterDrillFile,
        urbanfloodDrillConducted: formData.urbanfloodDrillConducted || "no",
        urbanfloodDrillCount: parseCountSafe(formData.urbanfloodDrillCount),
        urbanfloodDrillLastDate: parseDate(formData.urbanfloodDrillLastDate),
        urbanFloodDrillFile,
        otherDrillConducted: formData.otherDrillConducted || "no",
        otherDrillCount: parseCountSafe(formData.otherDrillCount),
        otherDrillLastDate: parseDate(formData.otherDrillLastDate),
        otherDrillFile,
        hasSDMC: formData.hasSDMC || "no",
        hasRI: formData.hasRI || "no",
        hasMap: formData.hasMap || "no",
        sdmcFile,
        riFile,
        mapFile,
        uploadImage,
        uploadVideo,
        uploadLetter,
        gps: gpsData
      };

      // Save or update registration
      const existing = await Registration.findOne({ email });
      if (existing) {
        const updated = await Registration.findOneAndUpdate({ email }, { $set: newData }, { new: true });
        return res.status(200).json({ success: true, message: "Registration updated successfully", data: updated });
      } else {
        const saved = new Registration(newData);
        await saved.save();
        return res.status(201).json({ success: true, message: "Registration created successfully", data: saved });
      }

    } catch (err) {
      console.error("Error saving registration:", err);
      res.status(500).json({ success: false, message: "Registration failed", error: err.message });
    }
  }
);

console.log("Router loaded successfully!");

// Other GET/PUT routes (unchanged)
router.get("/register/alldata", getAllRegistrationsData);
router.get('/subadmindata', getDataByDistrict);
router.get("/register/id/:id", getRegistrationByID);
router.get("/getSchoolByUdiseCode/:udiseCode", getSchoolByUdiseCode);
router.put("/updateEmailAndNumberById/:id", updateEmailAndNumberById);
router.get("/test", (req, res) => res.json({ message: "route is working" }));


// Fix program field route
router.get("/fix-program-field", async (req, res) => {
  try {
    const result = await Registration.updateMany(
      { isProgram: { $exists: false } },
      { $set: { isProgram: false } }
    );
    console.log("🔍 Update Result:", result);
    res.json({ success: true, message: "Updated successfully", result });
  } catch (error) {
    console.error("❌ Error details:", error);
    res.status(500).json({
      success: false,
      error: "Update failed",
      details: error.message || "Unknown error",
    });
  }
});

// Get registration by email
router.get("/register/:email", async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const registration = await Registration.findOne({ email });

    if (!registration) {
      return res.status(404).json({ success: false, message: "No data found for this email." });
    }

    res.status(200).json({ success: true, data: registration });
  } catch (err) {
    console.error("Error fetching registration:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;