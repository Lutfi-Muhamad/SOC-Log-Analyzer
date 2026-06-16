import { useState } from "react"

function UploadForm({ onFileSelect }) {
  const [fileName, setFileName] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    onFileSelect(file)
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave() {
    setDragOver(false)
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("file-input").click()}
        style={{
          border: dragOver ? "2px solid #1D9E75" : "2px dashed #888",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "#04342C22" : "transparent",
        }}
      >
        <p>Drop your auth.log here</p>
        <p style={{ fontSize: "13px", color: "#888" }}>or click to browse</p>
        <input
          id="file-input"
          type="file"
          accept=".log,.txt"
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
      </div>

      {fileName && (
        <p style={{ marginTop: "10px", fontSize: "13px", color: "#888" }}>
          Selected: {fileName}
        </p>
      )}
    </div>
  )
}

export default UploadForm