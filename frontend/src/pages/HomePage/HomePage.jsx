import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000/api/file";

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/history`);
      setTranscriptions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert("Select an audio file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("audio", selectedFile);

      await axios.post(`${BACKEND_URL}/transcribe`, formData);

      fetchHistory();
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const formData = new FormData();

      formData.append(
        "audio",
        blob,
        `recording-${Date.now()}.webm`
      );

      try {
        setLoading(true);

        await axios.post(
          `${BACKEND_URL}/transcribe`,
          formData
        );

        fetchHistory();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-slate-800">
            Speech To Text
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Upload audio or record your voice and
            instantly generate transcriptions.
          </p>
        </div>

        {/* Upload + Record Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Upload Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 transition hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-5">
              Upload Audio
            </h2>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
              className="w-full border rounded-xl p-3 mb-4"
            />

            <button
              onClick={handleFileUpload}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 hover:scale-[1.02]"
            >
              Upload & Transcribe
            </button>
          </div>

          {/* Record Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 transition hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-5">
              Voice Recorder
            </h2>

            {!recording ? (
              <button
                onClick={startRecording}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300 hover:scale-[1.02]"
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold animate-pulse hover:bg-red-700 transition duration-300"
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-8 text-center">
            <div className="animate-pulse text-blue-600 font-semibold">
              Processing Audio...
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Transcription History
          </h2>

          {transcriptions.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl shadow text-center text-slate-500">
              No transcriptions available.
            </div>
          ) : (
            <div className="grid gap-5">
              {transcriptions.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      #{index + 1}
                    </span>

                    <span className="text-sm text-slate-400">
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleString()
                        : "Recent"}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
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