

const mongoose = require("mongoose");

const PosterRegistrationSchema = new mongoose.Schema({
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
  quotes: String,
  principalName: String,
   isProgram: { type: Boolean, default: false },
  designation: String,
  uploadImage: [String],
  uploadVideo: [String],
  principalImage: [String]

  
  
});






module.exports = mongoose.model("RegistrationPoster", PosterRegistrationSchema);