import { useState } from "react";

function UploadForm({ onFileSelect }) {
  const [fileName, setFileName] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onClick={() => document.getElementById("file-input").click()}
      style={{
        border: dragOver ? "1.5px solid #1D9E75" : "1.5px dashed #333",
        borderRadius: "12px",
        padding: "2rem 1rem",
        textAlign: "center",
        cursor: "pointer",
        background: dragOver ? "#04342C22" : "#1a1a1a",
        transition: "all 0.15s",
      }}
    >
      <div style={{ fontSize: "28px", color: "#1D9E75", marginBottom: "8px" }}>
        ↑
      </div>
      <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
        Drop your auth.log here
      </p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        or click to browse — .log and .txt supported
      </p>

      <input
        id="file-input"
        type="file"
        accept=".log,.txt"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {fileName && (
        <div
          style={{
            marginTop: "12px",
            padding: "6px 14px",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "6px",
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#888",
            display: "inline-block",
          }}
        >
          {fileName}
        </div>
      )}
    </div>
  );
}

export default UploadForm;
