import { useState } from "react";
import UploadForm from "../components/UploadForm";
import StatsCard from "../components/StatsCard";
import AlertBox from "../components/AlertBox";
import { analyzeLog } from "../services/api";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileSelect(selectedFile) {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  }

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeLog(file);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze log. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const alerts = result ? result.alerts : [];

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{ fontSize: "20px", fontWeight: "500", marginBottom: "4px" }}
        >
          Mini SOC Log Analyzer
        </h1>
        <p style={{ fontSize: "13px", color: "#888" }}>
          Upload an auth.log file to detect brute force activity
        </p>
      </div>

      <UploadForm onFileSelect={handleFileSelect} />

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        style={{
          marginTop: "12px",
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: !file || loading ? "#ccc" : "#0F6E56",
          color: !file || loading ? "#888" : "#9FE1CB",
          fontSize: "14px",
          fontWeight: "500",
          cursor: !file || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze log"}
      </button>

      {error && (
        <p style={{ marginTop: "10px", fontSize: "13px", color: "#D85A30" }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "10px",
              marginBottom: "1.5rem",
            }}
          >
            <StatsCard label="Total entries" value={result.total_logs} />
            <StatsCard
              label="Failed logins"
              value={result.failed_login}
              color="#D85A30"
            />
            <StatsCard
              label="Unique IPs"
              value={result.unique_ip}
              color="#1D9E75"
            />
            <StatsCard
              label="Brute force"
              value={result.alerts.length}
              color="#BA7517"
            />
          </div>

          <p
            style={{
              fontSize: "12px",
              color: "#888",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Alerts
          </p>
          <AlertBox alerts={alerts} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
