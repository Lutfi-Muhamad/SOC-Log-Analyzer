function SeverityBadge({ severity }) {
  if (!severity) return null;

  const { score, level, color } = severity;

  const bgMap = {
    Clean: "#021a12",
    Low: "#021a12",
    Medium: "#1a1200",
    High: "#1a0a06",
    Critical: "#1a0800",
  };

  const borderMap = {
    Clean: "#0F6E56",
    Low: "#0F6E56",
    Medium: "#3d2a00",
    High: "#4a1b0c",
    Critical: "#4a1b0c",
  };

  return (
    <div
      style={{
        background: bgMap[level],
        border: `1px solid ${borderMap[level]}`,
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
          Session risk
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "500",
              fontFamily: "monospace",
              color: color,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "#444",
            }}
          >
            pts
          </span>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "500",
            color: color,
            background: bgMap[level],
            border: `1px solid ${color}55`,
          }}
        >
          {level}
        </span>
        <p
          style={{
            fontSize: "11px",
            color: "#444",
            marginTop: "6px",
            fontFamily: "monospace",
          }}
        >
          {getBreakdown(severity)}
        </p>
      </div>
    </div>
  );
}

function getBreakdown(severity) {
  if (severity.level === "Clean") return "no threats detected";
  if (severity.score <= 40) return "minor activity";
  if (severity.score <= 80) return "moderate threat activity";
  if (severity.score <= 150) return "significant threat activity";
  return "critical — immediate action required";
}

export default SeverityBadge;
