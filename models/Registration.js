// const mongoose = require("mongoose");

// const registrationSchema = new mongoose.Schema({
//   // Basic School Information
//   schoolName: { type: String, required: true, trim: true },
//   teacherName: { type: String, required: true, trim: true },
//   teacherContact: { type: String, required: true, trim: true },
//   email: { type: String, required: true, trim: true },
//   schoolType: { type: String, required: true, enum: ['Private', 'Government', 'Other'], default: 'Private' },
  
//   // Location Information
//   state: { type: String, required: true },
//   district: { type: String, required: true },
//   block: { type: String, required: true },
//   udiseCode: { type: String, required: true, trim: true },
  
//   // Student Information
//   totalStudentsMale: { type: Number, default: 0, min: 0 },
//   totalStudentsFemale: { type: Number, default: 0, min: 0 },
//   trainedStudentsMale: { type: Number, default: 0, min: 0 },
//   trainedStudentsFemale: { type: Number, default: 0, min: 0 },
//   trainedDisabledStudentsMale: { type: Number, default: 0, min: 0 },
//   trainedDisabledStudentsFemale: { type: Number, default: 0, min: 0 },
  
//   // Teacher Information
//   totalTeachersMale: { type: Number, default: 0, min: 0 },
//   totalTeachersFemale: { type: Number, default: 0, min: 0 },
//   trainedTeachersMale: { type: Number, default: 0, min: 0 },
//   trainedTeachersFemale: { type: Number, default: 0, min: 0 },
//   trainedDisabledTeachersMale: { type: Number, default: 0, min: 0 },
//   trainedDisabledTeachersFemale: { type: Number, default: 0, min: 0 },
  
//   // Disaster Management Information
//   hasDMPlan: { type: String, enum: ['yes', 'no'], default: 'no' },
//   rapidSurvay: { type: String, enum: ['yes', 'no'], default: 'no' },
//   hasDrill: { type: String, enum: ['yes', 'no'], default: 'no' },
  
//   // Fire Drill Information
//   fireDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // fireDrillCount: { type: Number, min: 0, max: 2, default: 0 },
//   // fireDrillLastDate: { type: Date },
//   // fireDrillFile: { type: String },
  
//   // Earthquake Drill Information
//   earthquakeDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // earthquakeDrillCount: { type: Number, min: 0, max: 2, default: 0 },
//   // earthquakeDrillLastDate: { type: Date },
//   // earthquakeDrillFile: { type: String },
  
//   // Heatwave Drill Information
//   heatwaveDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // heatwaveDrillCount: { type: Number, min: 0, max: 2, default: 0 },
//   // heatwaveDrillLastDate: { type: Date },
//   // heatwaveDrillFile: { type: String },
  
//   // Regional Disaster Drill Information
//   regionaldisasterDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // regionaldisasterDrillCount: { type: Number, min: 0, max: 2, default: 0 },
//   // regionaldisasterDrillLastDate: { type: Date },
//   // regionDisasterDrillFile: { type: String },
  
//   // Urban Flood Drill Information
//   urbanfloodDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // urbanfloodDrillCount: { type: Number, min: 0, max: 2, default: 0 },
//   // urbanfloodDrillLastDate: { type: Date },
//   // urbanFloodDrillFile: { type: String },
  
//   // Other Drill Information
//   otherDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // otherDrillCount: { type: Number, min: 0, max: 2, default: 0 },
//   // otherDrillLastDate: { type: Date },
//   // otherDrillFile: { type: String },
  
//   // Committee and Documentation
//   // hasSDMC: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // sdmcFile: { type: String },
  
//   // hasRI: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // riFile: { type: String },
  
//   // hasMap: { type: String, enum: ['yes', 'no'], default: 'no' },
//   // mapFile: { type: String },
  
//   // Media Files
//   uploadImage: [{ type: String }],
//   uploadVideo: [{ type: String }],
//   uploadLetter: { type: String },
  
//   // GPS Location
//   gps: {
//     latitude: { type: Number },
//     longitude: { type: Number }
//   },
  
//   // Legacy fields
//   malestudentCount: { type: String },
//   femalestudentCount: { type: String },
//   malestaffCount: { type: String },
//   femalestaffCount: { type: String },
//   address: { type: String },
//   pincode: { type: String },
//   designation: { type: String },
//   isProgram: { type: Boolean, default: false },
//   confirmationLetter: { type: String }

// }, {
//   timestamps: true
// });

// // Add indexes
// registrationSchema.index({ email: 1 });
// registrationSchema.index({ udiseCode: 1 });
// registrationSchema.index({ state: 1, district: 1 });

// module.exports = mongoose.model("Registration", registrationSchema);



const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  // Basic School Information
  schoolName: { type: String, required: true, trim: true },
  teacherName: { type: String, required: true, trim: true },
  teacherContact: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  schoolType: { type: String, required: true, enum: ['Private', 'Government', 'Other'], default: 'Private' },
  
  // Location Information
  state: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  udiseCode: { type: String, required: true, trim: true },
  address: { type: String }, // Added for UI compatibility
  
  // Student Information
  c: { type: Number, default: 0, min: 0 },
  totalStudentsFemale: { type: Number, default: 0, min: 0 },
  totalStudents: { 
    type: Number, 
    default: 0,
    // Virtual field calculation can be done in pre-save hook
  },
  trainedStudentsMale: { type: Number, default: 0, min: 0 },
  trainedStudentsFemale: { type: Number, default: 0, min: 0 },
  trainedDisabledStudentsMale: { type: Number, default: 0, min: 0 },
  trainedDisabledStudentsFemale: { type: Number, default: 0, min: 0 },
  
  // Teacher Information
  totalTeachersMale: { type: Number, default: 0, min: 0 },
  totalTeachersFemale: { type: Number, default: 0, min: 0 },
  totalTeachers: { 
    type: Number, 
    default: 0,
    // Virtual field calculation can be done in pre-save hook
  },
  trainedTeachersMale: { type: Number, default: 0, min: 0 },
  trainedTeachersFemale: { type: Number, default: 0, min: 0 },
  trainedDisabledTeachersMale: { type: Number, default: 0, min: 0 },
  trainedDisabledTeachersFemale: { type: Number, default: 0, min: 0 },
  
  // Program Information
  programLike: { type: String, default: 'No' }, // Added for UI compatibility
  
  // Disaster Management Information - Fixed field names to match UI
  disasterPlan: { type: String, enum: ['yes', 'no'], default: 'no' }, // was hasDMPlan
  rapidVisualSurvey: { type: String, enum: ['yes', 'no'], default: 'no' }, // was rapidSurvay (fixed typo)
  drillsLastSixMonths: { type: String, enum: ['yes', 'no'], default: 'no' }, // was hasDrill
  disasterCommittee: { type: String, enum: ['yes', 'no'], default: 'no' }, // Added
  resourceInventory: { type: String, enum: ['yes', 'no'], default: 'no' }, // Added
  evacuationPlan: { type: String, enum: ['yes', 'no'], default: 'no' }, // Added
  
  // Legacy disaster management fields (keep for backward compatibility)
  hasDMPlan: { type: String, enum: ['yes', 'no'], default: 'no' },
  rapidSurvay: { type: String, enum: ['yes', 'no'], default: 'no' },
  hasDrill: { type: String, enum: ['yes', 'no'], default: 'no' },
  
  // Fire Drill Information
  fireDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
 
  
  // Earthquake Drill Information
  earthquakeDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
 
  
  // Heatwave Drill Information
  heatwaveDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
 
  // Regional Disaster Drill Information
  regionaldisasterDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },

  
  // Urban Flood Drill Information
  urbanfloodDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
 
  // Other Drill Information
  otherDrillConducted: { type: String, enum: ['yes', 'no'], default: 'no' },
 
  
  // Media Files
  uploadImage: [{ type: String }],
  uploadVideo: [{ type: String }],
  uploadLetter: { type: String },
  
  // GPS Location
  gps: {
    latitude: { type: Number },
    longitude: { type: Number }
  },

  status: {
    type: String,
    enum: ["accept", "reject"], 
    default: "reject",          
  },
  
  // Legacy fields
  malestudentCount: { type: String },
  femalestudentCount: { type: String },
  malestaffCount: { type: String },
  femalestaffCount: { type: String },
  pincode: { type: String },
  designation: { type: String },
  isProgram: { type: Boolean, default: false },
  confirmationLetter: { type: String }

}, {
  timestamps: true
});

// Pre-save middleware to calculate totals
registrationSchema.pre('save', function(next) {
  // Calculate total students
  this.totalStudents = (this.totalStudentsMale || 0) + (this.totalStudentsFemale || 0);
  
  // Calculate total teachers
  this.totalTeachers = (this.totalTeachersMale || 0) + (this.totalTeachersFemale || 0);
  
  // Sync legacy fields with new fields for backward compatibility
  if (this.disasterPlan && !this.hasDMPlan) {
    this.hasDMPlan = this.disasterPlan;
  }
  if (this.rapidVisualSurvey && !this.rapidSurvay) {
    this.rapidSurvay = this.rapidVisualSurvey;
  }
  if (this.drillsLastSixMonths && !this.hasDrill) {
    this.hasDrill = this.drillsLastSixMonths;
  }
  
  // Set programLike based on isProgram
  if (typeof this.isProgram === 'boolean') {
    this.programLike = this.isProgram ? 'Yes' : 'No';
  }
  
  next();
});

// Pre-update middleware for findOneAndUpdate operations
registrationSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  
  // Handle $set operations
  if (update.$set) {
    // Calculate totals if male/female counts are being updated
    if (update.$set.totalStudentsMale !== undefined || update.$set.totalStudentsFemale !== undefined) {
      const maleStudents = update.$set.totalStudentsMale || 0;
      const femaleStudents = update.$set.totalStudentsFemale || 0;
      update.$set.totalStudents = maleStudents + femaleStudents;
    }
    
    if (update.$set.totalTeachersMale !== undefined || update.$set.totalTeachersFemale !== undefined) {
      const maleTeachers = update.$set.totalTeachersMale || 0;
      const femaleTeachers = update.$set.totalTeachersFemale || 0;
      update.$set.totalTeachers = maleTeachers + femaleTeachers;
    }
    
    // Sync fields
    if (update.$set.disasterPlan) update.$set.hasDMPlan = update.$set.disasterPlan;
    if (update.$set.rapidVisualSurvey) update.$set.rapidSurvay = update.$set.rapidVisualSurvey;
    if (update.$set.drillsLastSixMonths) update.$set.hasDrill = update.$set.drillsLastSixMonths;
    if (update.$set.isProgram !== undefined) {
      update.$set.programLike = update.$set.isProgram ? 'Yes' : 'No';
    }
  }
  
  next();
});

// Add indexes
registrationSchema.index({ email: 1 });
registrationSchema.index({ udiseCode: 1 });
registrationSchema.index({ state: 1, district: 1 });

module.exports = mongoose.model("Registration", registrationSchema);