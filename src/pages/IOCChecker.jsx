import { useState } from "react";
import { checkIOC } from "../services/api";
import StatsCard from "../components/StatsCard";

const IPV4_PATTERN =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const VERDICT_STYLES = {
  malicious: { color: "#D85A30", bg: "#1a0a06", label: "Malicious" },
  suspicious: { color: "#BA7517", bg: "#1a1200", label: "Suspicious" },
  clean: { color: "#1D9E75", bg: "#021a12", label: "Clean" },
};

function IOCChecker() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheck() {
    setError(null);
    setResult(null);

    if (!IPV4_PATTERN.test(ip.trim())) {
      setError("Enter a valid IPv4 address (e.g. 8.8.8.8)");
      return;
    }

    setLoading(true);
    try {
      const data = await checkIOC(ip.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || "Lookup failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleCheck();
  }

  const verdictStyle = result ? VERDICT_STYLES[result.verdict] : null;

  return (
    <div
      style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 1.5rem" }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "16px", fontWeight: "500", color: "#e0e0e0" }}>
          IOC Checker
        </h1>
        <p style={{ fontSize: "12px", color: "#444" }}>
          Manual IP reputation lookup via VirusTotal
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 8.8.8.8"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #2a2a2a",
            background: "#1a1a1a",
            color: "#e0e0e0",
            fontSize: "14px",
            fontFamily: "monospace",
            outline: "none",
          }}
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #2a2a2a",
            background: loading ? "#1a1a1a" : "#0F6E56",
            color: loading ? "#444" : "#9FE1CB",
            fontSize: "14px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: "10px", fontSize: "13px", color: "#D85A30" }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              background: verdictStyle.bg,
              border: `1px solid ${verdictStyle.color}55`,
              borderRadius: "10px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                {result.ip} {result.cached && "· cached"}
              </p>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  color: verdictStyle.color,
                }}
              >
                {verdictStyle.label}
              </span>
            </div>
            <div
              style={{ textAlign: "right", fontSize: "12px", color: "#444" }}
            >
              {result.as_owner && (
                <p style={{ margin: 0 }}>{result.as_owner}</p>
              )}
              {result.country && (
                <p style={{ margin: "2px 0 0" }}>{result.country}</p>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "10px",
              marginBottom: "1.5rem",
            }}
          >
            <StatsCard
              label="Malicious"
              value={result.stats.malicious}
              color="#D85A30"
            />
            <StatsCard
              label="Suspicious"
              value={result.stats.suspicious}
              color="#BA7517"
            />
            <StatsCard
              label="Harmless"
              value={result.stats.harmless}
              color="#1D9E75"
            />
            <StatsCard label="Engines" value={result.stats.total_engines} />
          </div>

          {result.tags && result.tags.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#444",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Tags
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#888",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IOCChecker;
