import { useState, useEffect } from "react";
import { updateRules, getRules } from "../services/api";

const DEFAULT_PATTERNS = [
  "Failed password",
  "authentication failure",
  "Invalid user",
  "failed login",
];

function RuleEditor() {
  const [threshold, setThreshold] = useState(5);
  const [patterns, setPatterns] = useState(DEFAULT_PATTERNS);
  const [newPattern, setNewPattern] = useState("");
  const [csThreshold, setCsThreshold] = useState(3);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRules() {
      try {
        const data = await getRules();
        setThreshold(data.brute_force_threshold);
        setCsThreshold(data.credential_stuffing_threshold);
        setPatterns(data.fail_patterns);
      } catch (err) {
        console.log("Could not load rules from backend");
      }
    }
    loadRules();
  }, []);

  function handleAddPattern() {
    const trimmed = newPattern.trim();
    if (!trimmed || patterns.includes(trimmed)) return;
    setPatterns([...patterns, trimmed]);
    setNewPattern("");
  }

  function handleRemovePattern(index) {
    setPatterns(patterns.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setError(null);
    try {
      await updateRules({
        brute_force_threshold: threshold,
        credential_stuffing_threshold: csThreshold,
        fail_patterns: patterns,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Failed to save. Make sure backend is running.");
    }
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#e0e0e0",
            marginBottom: "4px",
          }}
        >
          Rule Editor
        </h1>
        <p style={{ fontSize: "12px", color: "#444" }}>
          Customize detection thresholds and log patterns
        </p>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "10px",
          padding: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#555",
            marginBottom: "1rem",
          }}
        >
          Thresholds
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <label style={{ fontSize: "13px", color: "#888" }}>
              Brute force threshold
            </label>
            <span
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#1D9E75",
              }}
            >
              {threshold} attempts
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={20}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#1D9E75" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#444",
              marginTop: "4px",
            }}
          >
            <span>2</span>
            <span>20</span>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <label style={{ fontSize: "13px", color: "#888" }}>
              Credential stuffing threshold
            </label>
            <span
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#BA7517",
              }}
            >
              {csThreshold} usernames
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            value={csThreshold}
            onChange={(e) => setCsThreshold(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#BA7517" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#444",
              marginTop: "4px",
            }}
          >
            <span>2</span>
            <span>10</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "10px",
          padding: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#555",
            marginBottom: "1rem",
          }}
        >
          Fail patterns
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "1rem",
          }}
        >
          {patterns.map((pattern, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 12px",
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: "monospace",
                  color: "#888",
                }}
              >
                {pattern}
              </span>
              <button
                onClick={() => handleRemovePattern(index)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#444",
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: 1,
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddPattern()}
            placeholder="Add new pattern..."
            style={{
              flex: 1,
              padding: "8px 12px",
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              color: "#e0e0e0",
              fontSize: "13px",
              fontFamily: "monospace",
              outline: "none",
            }}
          />
          <button
            onClick={handleAddPattern}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              color: "#888",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#0F6E56",
          color: "#9FE1CB",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        {saved ? "✓ Rules saved" : "Save rules"}
      </button>

      {error && (
        <p style={{ marginTop: "10px", fontSize: "13px", color: "#D85A30" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default RuleEditor;
