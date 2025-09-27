const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Registration = require('../models/Registration');

const uploadExcelData = async (req, res) => {
    console.log(req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required.' });
    }

    // Read the uploaded file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON array of objects
    const data = XLSX.utils.sheet_to_json(sheet);

    let insertedCount = 0;
    let updatedCount = 0;
    const errors = [];

    // Loop over each row and insert/update in DB
    for (const row of data) {
      // Expecting email field to uniquely identify a record
      if (!row.email) {
        errors.push({ row, error: 'Missing email field' });
        continue;
      }

      try {
        const existing = await Registration.findOne({ email: row.email });

        if (existing) {
          // Update existing record (overwrite fields)
          Object.assign(existing, row);
          await existing.save();
          updatedCount++;
        } else {
          // Create new record
          const newReg = new Registration(row);
          await newReg.save();
          insertedCount++;
        }
      } catch (err) {
        errors.push({ row, error: err.message });
      }
    }

    // Remove the uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: 'Excel data processed successfully',
      insertedCount,
      updatedCount,
      errors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while processing Excel file' });
  }
};

module.exports = { uploadExcelData };
