function StatsCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        border: "1px solid #2a2a2a",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#555",
          marginBottom: "6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "500",
          fontFamily: "monospace",
          color: color || "#e0e0e0",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
