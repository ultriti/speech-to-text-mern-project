const express = require('express');

const router = express.Router();

const {
  upload_device,
  upload_db,
  fetchHistory
} = require('../controllers/file.controller');


router.post('/upload', upload_device);

router.post('/transcribe', upload_db);

router.get('/history', fetchHistory);

module.exports = router;