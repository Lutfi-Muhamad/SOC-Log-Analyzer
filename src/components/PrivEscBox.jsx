function PrivEscBox({ suspects }) {
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
        ✓ No privilege escalation detected
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {suspects.map((suspect, index) => (
        <div key={index} style={{
          padding: "12px 14px",
          borderRadius: "8px",
          border: "1px solid #26215C",
          background: "#0d0b1a",
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
              color: "#7F77DD",
              margin: 0,
            }}>
              ⚠ Privilege Escalation — {suspect.attempts} attempt{suspect.attempts > 1 ? "s" : ""}
            </p>
            <span style={{
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#534AB7",
            }}>
              {suspect.user}
            </span>
          </div>

          {suspect.source_ips.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {suspect.source_ips.map((ip, i) => (
                <span key={i} style={{
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#7F77DD",
                  background: "#0d0b1a",
                  border: "1px solid #26215C",
                }}>
                  {ip}
                </span>
              ))}
            </div>
          )}

          <p style={{
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#3C3489",
            margin: 0,
            wordBreak: "break-all",
          }}>
            {suspect.sample}
          </p>

        </div>
      ))}
    </div>
  )
}

export default PrivEscBox