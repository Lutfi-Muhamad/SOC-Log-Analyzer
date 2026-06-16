import { useState } from "react";
import UploadForm from "../components/UploadForm";
import StatsCard from "../components/StatsCard";
import AlertBox from "../components/AlertBox";
import { analyzeLog } from "../services/api";
import IPTable from "../components/IPTable";

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
    <div
      style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 1.5rem" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid #1f1f1f",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: "500", color: "#e0e0e0" }}>
            Mini SOC Log Analyzer
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#444",
              fontFamily: "monospace",
              marginTop: "2px",
            }}
          >
            v1.0.0 · auth.log parser
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: "500",
            padding: "3px 10px",
            borderRadius: "20px",
            background: "#085041",
            color: "#5DCAA5",
            border: "1px solid #1D9E75",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#5DCAA5",
              display: "inline-block",
              animation: "pulse 1.8s ease-in-out infinite",
            }}
          />
          System online
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <UploadForm onFileSelect={handleFileSelect} />

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #2a2a2a",
          background: !file || loading ? "#1a1a1a" : "#0F6E56",
          color: !file || loading ? "#444" : "#9FE1CB",
          fontSize: "14px",
          fontWeight: "500",
          cursor: !file || loading ? "not-allowed" : "pointer",
          transition: "background 0.15s",
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
              color: "#444",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Alerts
          </p>
          <AlertBox alerts={alerts} />

          <p
            style={{
              fontSize: "12px",
              color: "#444",
              marginBottom: "8px",
              marginTop: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Top IPs
          </p>
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <IPTable topIPs={result.top_ips} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
