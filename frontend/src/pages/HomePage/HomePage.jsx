import React, { useRef, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000/api/file";

  // ==========================
  // Upload File
  // ==========================
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("audio", selectedFile);

      const res = await axios.post(
        `${BACKEND_URL}/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscriptions((prev) => [
        {
          id: res.data.id,
          transcription: res.data.transcription,
        },
        ...prev,
      ]);

      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Start Recording
  // ==========================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();

        formData.append(
          "audio",
          audioBlob,
          `recording-${Date.now()}.webm`
        );

        try {
          setLoading(true);

          const res = await axios.post(
            `${BACKEND_URL}/transcribe`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setTranscriptions((prev) => [
            {
              id: res.data.id,
              transcription: res.data.transcription,
            },
            ...prev,
          ]);
        } catch (error) {
          console.error(error);
          alert("Transcription failed");
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
      alert("Microphone permission denied");
    }
  };

  // ==========================
  // Stop Recording
  // ==========================
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">
          Speech To Text
        </h1>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload Audio File
          </h2>

          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="mb-4 block w-full"
          />

          <button
            onClick={handleFileUpload}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Upload & Transcribe
          </button>
        </div>

        {/* Recorder Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Record Audio
          </h2>

          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Stop Recording
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-6">
            Processing audio...
          </div>
        )}

        {/* Transcriptions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Transcriptions
          </h2>

          {transcriptions.length === 0 ? (
            <p className="text-gray-500">
              No transcriptions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border rounded-lg p-4 bg-slate-50"
                >
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {item.transcription}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;