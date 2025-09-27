const express = require('express');
const upload = require('../middlewares/multer');
const uploadExcel = require('../middlewares/ExcelMulter');
const {
  updateEmailAndNumberPoster,
  getRegistrationByEmailPoster,
  getDataByDistrictPoster,
  getAllRegistrationsDataPoster,
  uploadFilesPoster,
  updateFormDataPoster,
  updatewhatsappstatusPoster,
} = require('../controllers/registerControllerPoster');
const { uploadExcelData } = require('../controllers/uploadExcelController');

const router = express.Router();

router.post(
  '/email/update-form',
  upload.fields([
    { name: "uploadImage", maxCount: 5 },
    { name: "uploadVideo", maxCount: 3 },
    { name: "principalImage", maxCount: 1 },
  ]),
  updateFormDataPoster
);

router.post('/upload-excel', uploadExcel.single('file'), uploadExcelData);

router.get('/email/:email', getRegistrationByEmailPoster);
router.post('/subadmindata', getDataByDistrictPoster);
router.get('/alldata', getAllRegistrationsDataPoster);
router.put('/updateemailandnumber/:id', updateEmailAndNumberPoster);

module.exports = router;
