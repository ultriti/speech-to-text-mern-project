const multer = require('multer');
const path = require('path');
const fs = require('fs');

const OpenAI = require('openai');

const {
  saveTranscription,
  getTranscriptions
} = require('../services/file.service');


// ================= OPENAI =================


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// ================= MULTER =================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const upload = multer({ storage }).single('audio');


// ================= FILE UPLOAD =================

module.exports.upload_device = (req, res) => {

  upload(req, res, (err) => {

    if (err) {
      return res.status(500).json({
        error: 'File upload failed',
        details: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    res.json({
      message: 'File uploaded successfully',
      file: req.file
    });

  });

};


// ================= TRANSCRIBE =================

module.exports.upload_db = async (req, res) => {

  upload(req, res, async (err) => {

    try {

      if (err) {
        return res.status(500).json({
          error: 'Upload failed',
          details: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'No audio file uploaded'
        });
      }

      const filePath = req.file.path;

      // ================= WHISPER =================

      const transcription = await openai.audio.transcriptions.create({

        file: fs.createReadStream(filePath),

        model: 'whisper-1',

        language: 'en'

      });

      // ================= SAVE DB =================

      const record = await saveTranscription(
        req.file.filename,
        transcription.text
      );

      res.json({
        id: record.id,
        transcription: record.transcription
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: 'Transcription failed',
        details: error.message
      });

    }

  });

};


// ================= FETCH HISTORY =================

module.exports.fetchHistory = async (req, res) => {

  try {

    const records = await getTranscriptions();

    res.json(records);

  } catch (err) {

    res.status(500).json({
      error: 'Failed to fetch history'
    });

  }

};