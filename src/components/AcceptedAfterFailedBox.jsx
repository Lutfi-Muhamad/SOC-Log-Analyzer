function AcceptedAfterFailedBox({ suspects }) {
  if (!suspects || suspects.length === 0) {
    return (
      <div style={{
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #2a2a2a",
        background: "#1a1a1a",
        fontSize: "13px",
        color: "#555",
      }}>
        ✓ No suspicious successful logins detected
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {suspects.map((suspect, index) => (
        <div key={index} style={{
          padding: "12px 14px",
          borderRadius: "8px",
          border: "1px solid #4a1b0c",
          background: "#1a0800",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#E24B4A",
              margin: 0,
            }}>
              🚨 Login succeeded after {suspect.failed_attempts} failed attempts
            </p>
            <span style={{
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#A32D2D",
            }}>
              {suspect.ip}
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {suspect.succeeded_as.map((user, i) => (
              <span key={i} style={{
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                fontFamily: "monospace",
                color: "#E24B4A",
                background: "#1a0800",
                border: "1px solid #4a1b0c",
              }}>
                {user}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AcceptedAfterFailedBox