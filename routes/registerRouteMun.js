const express = require('express');
const upload = require('../middlewares/multer');
const {updateEmailAndNumberMun, getRegistrationByEmailMun, getDataByDistrictMun,
   getAllRegistrationsDataMun, uploadFilesMun, updateFormDataMun,
    updatewhatsappstatusMun,
   } = require('../controllers/registerControllerMun');
const uploadExcel = require('../middlewares/ExcelMulter');
const { uploadExcelData } = require('../controllers/uploadExcelController');

const router = express.Router();


// router.post(
//   "/email/upload-files/:email",
//   upload.fields([
//     { name: "uploadImage", maxCount: 5 },
//     { name: "uploadVideo", maxCount: 3 },
//    // { name: "uploadLetter", maxCount: 1 },
//   ]),
//   uploadFilesMun
// );

// router.post('/email/:email/update-form', updateFormDataMun);
router.post('/email/update-form',upload.fields([
    { name: "uploadImage", maxCount: 5 },
    { name: "uploadVideo", maxCount: 3 },
   { name: "uploadedReport", maxCount: 1 },
  ]), updateFormDataMun);


router.post('/upload-excel',uploadExcel.single('file'), uploadExcelData);


router.get('/email/:email', getRegistrationByEmailMun);
router.post('/subadmindata', getDataByDistrictMun);
router.get('/alldata', getAllRegistrationsDataMun);
router.put('/updateemailandnumber/:id', updateEmailAndNumberMun);
// router.put('/updatewhatsappstatus/:id')

module.exports = router;
