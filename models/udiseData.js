const mongoose = require("mongoose");

const udiseData = new mongoose.Schema({
  schoolName: { type: String, required: true },
  teacherName: { type: String, required: true },
  teacherContact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  schoolType: {
    type: String,
    // enum: ["Private", "Government", "Other"],
    required: false,
  },
  UdiseSchCode:{type:String,required:true},
  state: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: false },

  totalStudents: { male: Number, female: Number },
  trainedStudents: { male: Number, female: Number },
  trainedDisabledStudents: { male: Number, female: Number },

  totalTeachers: { male: Number, female: Number },
  trainedTeachers: { male: Number, female: Number },
  trainedDisabledTeachers: { male: Number, female: Number },

  hasDMPlan: { type: String, enum: ["yes", "no"] },
  hasDrill: { type: String, enum: ["yes", "no"] },

  fireDrill: {
    conducted: String,
    lastDate: Date,
    document: String, 
  },
  earthquakeDrill: {
    conducted: String,
    lastDate: Date,
    document: String, 
  },
  otherDrill: {
    conducted: String,
    lastDate: Date,
    document: String, 
  },

  hasSDMC: { type: String, enum: ["yes", "no"] },
  sdmcFile: String,
  rapidSurvay: { type: String, enum: ["yes", "no"] },
  rapidSurvayFile: String,
  hasRI: { type: String, enum: ["yes", "no"] },
  riFile: String,
  hasMap: { type: String, enum: ["yes", "no"] },
  mapFile: String,

  confirmationLetter: String, 
  evidencePhotos: [String], 
  evidenceVideos: [String], 

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

udiseData.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// module.exports = mongoose.model("udisec", udiseData);
module.exports = mongoose.model("udisec", udiseData, "udisec");
