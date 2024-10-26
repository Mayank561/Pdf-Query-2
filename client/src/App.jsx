import { useState } from "react";
import axios from "axios";
import "./App.css"; 
import { LuSendHorizonal } from "react-icons/lu";
import { CiFileOn, CiCirclePlus } from "react-icons/ci";

export function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/upload", formData);
      console.log(res.data);
      alert("File uploaded successfully!");
      setFile(null); 
    } catch (err) {
      console.error(err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    try {
      const res = await axios.post("http://localhost:8000/talk", { question });
      setResponse(res.data.message);
      setQuestion(""); 
    } catch (err) {
      console.error(err);
      alert("Failed to get a response.");
    }
  };

  return (
    <section className="app-container">
      <header className="Header">
        <div>
          <img
            src="https://res.cloudinary.com/djywrhroe/image/upload/v1716726599/Shaurya-Frontend/LogoPNG2_g0nvky.png"
            alt="Logo"
            className="logoImage"
          />
        </div>
        <div className="labelclass">
          <label className="file-input-label">
            <CiFileOn size={24} style={{ marginRight: "8px", border: "1px solid greenyellow" }} />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <span className="upload-text-1">Upload PDF</span>
            {file && <span className="uploaded-filename">: {file.name}</span>} 
          </label>
          <button
            className="btn"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            <CiCirclePlus size={20} className="circle"  />
            <span className="upload-text">{loading ? "Uploading..." : "Upload PDF"}</span>
          </button>
        </div>
      </header>
      <div className="content-container">
        <div className="response-container">
          {response && <p><strong>Response:</strong> {response}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="form-container"
        >
          <div className="input-container">
            <input
              type="text"
              placeholder="Send a message...."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="input-field"
            />
            <button
              type="submit"
              disabled={!question}
              className="submit-button"
            >
              <LuSendHorizonal />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
