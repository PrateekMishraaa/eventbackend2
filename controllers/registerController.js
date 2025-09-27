const Registration = require("../models/Registration");
const UdiseData = require ("../models/udiseData");
const sharp = require("sharp");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const udiseData = require("../models/udiseData");
const userMeta = {};

ffmpeg.setFfmpegPath(ffmpegPath);

// Compression functions (keeping your existing ones)
async function compressImage(inputPath, outputPath, maxSizeMB = 10) {
  try {
    const originalSize = fs.statSync(inputPath).size / (1024 * 1024);
    if (originalSize <= maxSizeMB) return;

    const tempOutput = path.join(
      path.dirname(outputPath),
      `temp_${Date.now()}.jpg`
    );

    await sharp(inputPath)
      .resize({ width: 1920 })
      .jpeg({ quality: 80 })
      .toFile(tempOutput);

    const compressedSize = fs.statSync(tempOutput).size / (1024 * 1024);
    if (compressedSize > maxSizeMB) {
      await sharp(tempOutput)
        .resize({ width: 1280 })
        .jpeg({ quality: 60 })
        .toFile(tempOutput);
    }

    fs.renameSync(tempOutput, outputPath);
  } catch (error) {
    console.error("Image compression failed:", error);
  }
}

function compressVideo(inputPath, outputPath, maxSizeMB = 50) {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(inputPath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    if (fileSizeInMB <= maxSizeMB) return resolve();

    const tempPath = path.join(
      path.dirname(outputPath),
      `temp_${Date.now()}.mp4`
    );

    ffmpeg(inputPath)
      .videoCodec("libx264")
      .outputOptions("-crf 28")
      .on("end", () => {
        fs.renameSync(tempPath, outputPath);
        resolve();
      })
      .on("error", (err) => {
        reject(`Video compression failed: ${err.message}`);
      })
      .save(tempPath);
  });
}

async function compressPDF(inputPath, outputPath) {
  let currentPath = inputPath;
  let tempPath = path.join(__dirname, "temp_compressed.pdf");
  let prevSize = fs.statSync(currentPath).size;
  let currentSize = prevSize;
  const maxSize = 10 * 1024 * 1024;

  while (currentSize > maxSize) {
    const inputBytes = fs.readFileSync(currentPath);
    const pdfDoc = await PDFDocument.load(inputBytes);
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    fs.writeFileSync(tempPath, pdfBytes);
    currentSize = fs.statSync(tempPath).size;

    if (currentSize >= prevSize) {
      console.log("No further compression possible.");
      break;
    }

    console.log(
      `Compressed size: ${(currentSize / 1024 / 1024).toFixed(2)} MB`
    );
    prevSize = currentSize;
    currentPath = tempPath;
  }

  fs.copyFileSync(currentPath, outputPath);
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

  console.log(`Final file saved to: ${outputPath}`);
}

const handleRegistration = async (req, res) => {
  try {
    const { email } = req.params;
    const {
      // Basic school information
      schoolName,
      teacherName,
      teacherContact,
      schoolType,
      state,
      district,
      block,
      udiseCode,
      
      // Student information
      totalStudentsMale,
      totalStudentsFemale,
      trainedStudentsMale,
      trainedStudentsFemale,
      trainedDisabledStudentsMale,
      trainedDisabledStudentsFemale,
      
      // Teacher information
      totalTeachersMale,
      totalTeachersFemale,
      trainedTeachersMale,
      trainedTeachersFemale,
      trainedDisabledTeachersMale,
      trainedDisabledTeachersFemale,
      
      // Disaster management
      hasDMPlan,
      rapidSurvay,
      hasDrill,
      
      // Fire drill
      fireDrillConducted,
      fireDrillCount,
      fireDrillLastDate,
      
      // Earthquake drill
      earthquakeDrillConducted,
      earthquakeDrillCount,
      earthquakeDrillLastDate,
      
      // Heatwave drill
      heatwaveDrillConducted,
      heatwaveDrillCount,
      heatwaveDrillLastDate,
      
      // Regional disaster drill
      regionaldisasterDrillConducted,
      regionaldisasterDrillCount,
      regionaldisasterDrillLastDate,
      
      // Urban flood drill
      urbanfloodDrillConducted,
      urbanfloodDrillCount,
      urbanfloodDrillLastDate,
      
      // Other drill
      otherDrillConducted,
      otherDrillCount,
      otherDrillLastDate,
      
      // Committees and documentation
      hasSDMC,
      hasRI,
      hasMap,
      
      // GPS location
      gps,
      
      // Legacy fields for backward compatibility
      address,
      pincode,
      designation,
      malestudentCount,
      femalestudentCount,
      malestaffCount,
      femalestaffCount,
    } = req.body;

    // Handle file uploads
    const uploadImages = req.files?.uploadImage || [];
    const uploadVideos = req.files?.uploadVideo || [];
    const uploadLetter = req.files?.uploadLetter?.[0]?.path || "";
    
    // Handle specific drill files
    const sdmcFile = req.files?.sdmcFile?.[0]?.path || "";
    const riFile = req.files?.riFile?.[0]?.path || "";
    const mapFile = req.files?.mapFile?.[0]?.path || "";
    const fireDrillFile = req.files?.fireDrillFile?.[0]?.path || "";
    const earthquakeDrillFile = req.files?.earthquakeDrillFile?.[0]?.path || "";
    const heatwaveDrillFile = req.files?.heatwaveDrillFile?.[0]?.path || "";
    const regionDisasterDrillFile = req.files?.regionDisasterDrillFile?.[0]?.path || "";
    const urbanFloodDrillFile = req.files?.urbanFloodDrillFile?.[0]?.path || "";
    const otherDrillFile = req.files?.otherDrillFile?.[0]?.path || "";

    if (!email) {
      return res.status(400).json({ message: "Email is required in params" });
    }

    // Validate required fields
    if (!schoolName || !teacherName || !teacherContact || !schoolType || 
        !state || !district || !block || !udiseCode) {
      return res.status(400).json({ 
        message: "Required fields missing: schoolName, teacherName, teacherContact, schoolType, state, district, block, udiseCode" 
      });
    }

    // Compress images
    const compressedImages = [];
    for (const file of uploadImages) {
      await compressImage(file.path, file.path);
      compressedImages.push(file.path);
    }

    // Compress videos
    const compressedVideos = [];
    for (const file of uploadVideos) {
      await compressVideo(file.path, file.path);
      compressedVideos.push(file.path);
    }

    // Compress PDFs
    const filesToCompress = [
      { path: uploadLetter, name: 'uploadLetter' },
      { path: sdmcFile, name: 'sdmcFile' },
      { path: riFile, name: 'riFile' },
      { path: mapFile, name: 'mapFile' },
      { path: fireDrillFile, name: 'fireDrillFile' },
      { path: earthquakeDrillFile, name: 'earthquakeDrillFile' },
      { path: heatwaveDrillFile, name: 'heatwaveDrillFile' },
      { path: regionDisasterDrillFile, name: 'regionDisasterDrillFile' },
      { path: urbanFloodDrillFile, name: 'urbanFloodDrillFile' },
      { path: otherDrillFile, name: 'otherDrillFile' }
    ];

    for (const file of filesToCompress) {
      if (file.path && fs.existsSync(file.path)) {
        await compressPDF(file.path, file.path);
      }
    }

    // Find or create registration
    let userRegistration = await Registration.findOne({ email });

    const newRegistrationData = {
      // Basic information
      schoolName,
      teacherName,
      teacherContact,
      email,
      schoolType,
      state,
      district,
      block,
      udiseCode,
      
      // Student information
      totalStudentsMale: totalStudentsMale ? parseInt(totalStudentsMale) : 0,
      totalStudentsFemale: totalStudentsFemale ? parseInt(totalStudentsFemale) : 0,
      trainedStudentsMale: trainedStudentsMale ? parseInt(trainedStudentsMale) : 0,
      trainedStudentsFemale: trainedStudentsFemale ? parseInt(trainedStudentsFemale) : 0,
      trainedDisabledStudentsMale: trainedDisabledStudentsMale ? parseInt(trainedDisabledStudentsMale) : 0,
      trainedDisabledStudentsFemale: trainedDisabledStudentsFemale ? parseInt(trainedDisabledStudentsFemale) : 0,
      
      // Teacher information
      totalTeachersMale: totalTeachersMale ? parseInt(totalTeachersMale) : 0,
      totalTeachersFemale: totalTeachersFemale ? parseInt(totalTeachersFemale) : 0,
      trainedTeachersMale: trainedTeachersMale ? parseInt(trainedTeachersMale) : 0,
      trainedTeachersFemale: trainedTeachersFemale ? parseInt(trainedTeachersFemale) : 0,
      trainedDisabledTeachersMale: trainedDisabledTeachersMale ? parseInt(trainedDisabledTeachersMale) : 0,
      trainedDisabledTeachersFemale: trainedDisabledTeachersFemale ? parseInt(trainedDisabledTeachersFemale) : 0,
      
      // Disaster management
      hasDMPlan,
      rapidSurvay,
      hasDrill,
      
      // Fire drill information
      fireDrillConducted,
      fireDrillCount: fireDrillCount ? parseInt(fireDrillCount) : 0,
      fireDrillLastDate: fireDrillLastDate ? new Date(fireDrillLastDate) : null,
      fireDrillFile,
      
      // Earthquake drill information
      earthquakeDrillConducted,
      earthquakeDrillCount: earthquakeDrillCount ? parseInt(earthquakeDrillCount) : 0,
      earthquakeDrillLastDate: earthquakeDrillLastDate ? new Date(earthquakeDrillLastDate) : null,
      earthquakeDrillFile,
      
      // Heatwave drill information
      heatwaveDrillConducted,
      heatwaveDrillCount: heatwaveDrillCount ? parseInt(heatwaveDrillCount) : 0,
      heatwaveDrillLastDate: heatwaveDrillLastDate ? new Date(heatwaveDrillLastDate) : null,
      heatwaveDrillFile,
      
      // Regional disaster drill information
      regionaldisasterDrillConducted,
      regionaldisasterDrillCount: regionaldisasterDrillCount ? parseInt(regionaldisasterDrillCount) : 0,
      regionaldisasterDrillLastDate: regionaldisasterDrillLastDate ? new Date(regionaldisasterDrillLastDate) : null,
      regionDisasterDrillFile,
      
      // Urban flood drill information
      urbanfloodDrillConducted,
      urbanfloodDrillCount: urbanfloodDrillCount ? parseInt(urbanfloodDrillCount) : 0,
      urbanfloodDrillLastDate: urbanfloodDrillLastDate ? new Date(urbanfloodDrillLastDate) : null,
      urbanFloodDrillFile,
      
      // Other drill information
      otherDrillConducted,
      otherDrillCount: otherDrillCount ? parseInt(otherDrillCount) : 0,
      otherDrillLastDate: otherDrillLastDate ? new Date(otherDrillLastDate) : null,
      otherDrillFile,
      
      // Committees and documentation
      hasSDMC,
      hasRI,
      hasMap,
      sdmcFile,
      riFile,
      mapFile,
      
      // Media files
      uploadImage: compressedImages,
      uploadVideo: compressedVideos,
      uploadLetter,
      
      // GPS location
      gps: gps ? JSON.parse(gps) : {},
      
      // Legacy fields (for backward compatibility)
      address,
      pincode,
      designation,
      malestudentCount,
      femalestudentCount,
      malestaffCount,
      femalestaffCount,
    };

    if (userRegistration) {
      // Update existing registration
      Object.keys(newRegistrationData).forEach(key => {
        if (newRegistrationData[key] !== undefined && newRegistrationData[key] !== null && newRegistrationData[key] !== '') {
          if (key === 'uploadImage' && Array.isArray(newRegistrationData[key]) && newRegistrationData[key].length > 0) {
            userRegistration.uploadImage.push(...newRegistrationData[key]);
          } else if (key === 'uploadVideo' && Array.isArray(newRegistrationData[key]) && newRegistrationData[key].length > 0) {
            userRegistration.uploadVideo.push(...newRegistrationData[key]);
          } else if (key !== 'uploadImage' && key !== 'uploadVideo') {
            userRegistration[key] = newRegistrationData[key];
          }
        }
      });

      await userRegistration.save();
    } else {
      // Create new registration
      userRegistration = new Registration(newRegistrationData);
      await userRegistration.save();
    }

    res.status(200).json({ 
      message: "Registration saved successfully!",
      data: userRegistration 
    });
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({ 
      message: "Server error while registering",
      error: error.message 
    });
  }
};

// Get all registrations
const getAllRegistrationsData = async (req, res) => {
  try {
    console.log("Fetching all registrations from DB...");

    const registrations = await Registration.find({}).sort({ createdAt: -1 });

    if (!registrations || registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No registrations found",
      });
    }

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (err) {
    console.error("Error fetching all registrations:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get registration by email
const getRegistrationByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const registration = await Registration.findOne({ email });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error("Error fetching registration by email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const getRegistrationByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//===================================== getSchoolByUdiseCode ===========================================//
const getSchoolByUdiseCode = async (req, res) => {
  try {
    const udiseCode = req.params.udiseCode?.trim(); // remove extra spaces
    console.log("Incoming UDISE Code:", udiseCode);

    const school = await udiseData.findOne({ UdiseSchCode: udiseCode });
    console.log("Found school:", school);

    if (!school) {
      return res.status(404).json({
        status: "fail",
        message: "No school found with that UDISE number",
      });
    }

    return res.status(200).json({
      status: "success",
      data: { school },
    });
  } catch (err) {
    console.error("Error in getSchoolByUdiseCode:", err.message);
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const updateEmailAndNumberById = async (req, res) => {
  const userId = req.params.id;
  const { email, phoneNumber } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID is required" });
  }

  if (!email && !phoneNumber) {
    return res.status(400).json({
      success: false,
      error: "At least email or phoneNumber must be provided"
    });
  }

  // Update or create metadata entry
  if (!userMeta[userId]) {
    userMeta[userId] = {};
  }
  if (email) userMeta[userId].email = email;
  if (phoneNumber) userMeta[userId].phoneNumber = phoneNumber;

  return res.status(200).json({
    success: true,
    message: `User data updated for ${userId}`,
    data: userMeta[userId]
  });
};

// Get registrations by district
const getDataByDistrict = async (req, res) => {
  try {
    const { district } = req.query;
    
    if (!district) {
      return res.status(400).json({
        success: false,
        message: "District is required"
      });
    }

    const registrations = await Registration.find({ 
      district: { $regex: district, $options: 'i' } 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error("Error fetching registrations by district:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete registration
const deleteRegistration = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const registration = await Registration.findOneAndDelete({ email });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getSchoolByUdiseCode,
  handleRegistration,
  getAllRegistrationsData,
  getRegistrationByEmail,
  getRegistrationByID,
  getDataByDistrict,
  deleteRegistration,
  updateEmailAndNumberById
};