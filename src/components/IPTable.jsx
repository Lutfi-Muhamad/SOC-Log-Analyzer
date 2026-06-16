function IPTable({ topIPs }) {
  if (!topIPs || topIPs.length === 0) {
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
        No IP data found
      </div>
    );
  }

  function getSeverity(count) {
    if (count > 10)
      return { label: "High risk", color: "#D85A30", bg: "#1a0a06" };
    if (count > 5)
      return { label: "Suspicious", color: "#BA7517", bg: "#1a1000" };
    return { label: "Normal", color: "#1D9E75", bg: "#04160f" };
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "13px",
      }}
    >
      <thead>
        <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
          <th
            style={{
              textAlign: "left",
              padding: "8px 10px",
              fontSize: "11px",
              fontWeight: "500",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            IP Address
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "8px 10px",
              fontSize: "11px",
              fontWeight: "500",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Failed attempts
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "8px 10px",
              fontSize: "11px",
              fontWeight: "500",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {topIPs.map((item, index) => {
          const severity = getSeverity(item.count);
          return (
            <tr key={index} style={{ borderBottom: "1px solid #1a1a1a" }}>
              <td
                style={{
                  padding: "9px 10px",
                  fontFamily: "monospace",
                  color: "#e0e0e0",
                }}
              >
                {item.ip}
              </td>
              <td
                style={{
                  padding: "9px 10px",
                  fontFamily: "monospace",
                  color: "#888",
                }}
              >
                {item.count}
              </td>
              <td style={{ padding: "9px 10px" }}>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: severity.color,
                    background: severity.bg,
                    border: `1px solid ${severity.color}33`,
                  }}
                >
                  {severity.label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default IPTable;
