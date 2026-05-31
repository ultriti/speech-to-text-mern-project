const pool = require('../config/db.config');

async function saveTranscription(filename, transcription) {

  const result = await pool.query(
    `
    INSERT INTO transcriptions
    (filename, transcription)
    VALUES ($1, $2)
    RETURNING *
    `,
    [filename, transcription]
  );

  return result.rows[0];
}

async function getTranscriptions() {

  const result = await pool.query(
    `
    SELECT *
    FROM transcriptions
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

module.exports = {
  saveTranscription,
  getTranscriptions
};