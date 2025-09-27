

const mongoose = require("mongoose");

const MunRegistrationSchema = new mongoose.Schema({
  schoolName: String,
  teacherName: String,
  teacherContact: String,
  email: { type: String, required:true , trim:true },
  schoolType: String,
  malestudentCount: String,
  femalestudentCount: String,
  malestaffCount: String,
  femalestaffCount: String,
  state: String,
  district: String,
  address: String,
  pincode: String,
   isProgram: { type: Boolean, default: false },
  designation: String,
  uploadImage: [String],
  uploadVideo: [String],
  uploadedReport: [String],
  
  
});


module.exports = mongoose.model("RegistrationMun", MunRegistrationSchema);