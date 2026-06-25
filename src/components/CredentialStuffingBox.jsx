function CredentialStuffingBox({ suspects }) {
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
        ✓ No credential stuffing detected
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
            border: "1px solid #3d2a00",
            background: "#1a1200",
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
                color: "#BA7517",
                margin: 0,
              }}
            >
              ⚠ Credential Stuffing — {suspect.count} usernames tried
            </p>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#854F0B",
              }}
            >
              {suspect.ip}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {suspect.usernames_tried.map((user, i) => (
              <span
                key={i}
                style={{
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#BA7517",
                  background: "#1a1000",
                  border: "1px solid #3d2a0044",
                }}
              >
                {user}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CredentialStuffingBox;
