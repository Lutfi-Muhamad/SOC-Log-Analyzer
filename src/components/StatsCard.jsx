function StatsCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#f5f5f5",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        border: "1px solid #e0e0e0",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#888",
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
          color: color || "#111",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
