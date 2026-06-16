function AlertBox({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #2a2a2a",
          background: "#1a1a1a",
          fontSize: "13px",
          color: "#555",
        }}
      >
        ✓ No threats detected
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #4a1b0c",
            background: "#1a0a06",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#D85A30",
              margin: 0,
            }}
          >
            ⚠ Possible Brute Force — {alert.count} attempts
          </p>
          <p
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#993C1D",
              margin: 0,
            }}
          >
            {alert.ip}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AlertBox;
