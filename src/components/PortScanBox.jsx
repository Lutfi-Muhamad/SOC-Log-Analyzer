function PortScanBox({ suspects }) {
  if (!suspects || suspects.length === 0) {
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
        ✓ No port scanning detected
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {suspects.map((suspect, index) => (
        <div
          key={index}
          style={{
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1px solid #0F6E56",
            background: "#021a12",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#1D9E75",
                margin: 0,
              }}
            >
              ⚠ Port Scan — {suspect.probe_count} probes ·{" "}
              {suspect.unique_ports} unique ports
            </p>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#0F6E56",
              }}
            >
              {suspect.ip}
            </span>
          </div>

          {suspect.ports_hit.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {suspect.ports_hit.map((port, i) => (
                <span
                  key={i}
                  style={{
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "#1D9E75",
                    background: "#021a12",
                    border: "1px solid #0F6E56",
                  }}
                >
                  :{port}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PortScanBox;
