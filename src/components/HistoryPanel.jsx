function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryPanel({
  history,
  activeId,
  onSelect,
  onDelete,
  onClear,
  onExport,
  storageWarning,
}) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#555",
            margin: 0,
          }}
        >
          History <span style={{ color: "#333" }}>({history.length}/20)</span>
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onExport}
            disabled={history.length === 0}
            style={{
              background: "none",
              border: "none",
              fontSize: "11px",
              color: history.length === 0 ? "#333" : "#1D9E75",
              cursor: history.length === 0 ? "not-allowed" : "pointer",
              padding: 0,
            }}
          >
            Export
          </button>
          <button
            onClick={onClear}
            disabled={history.length === 0}
            style={{
              background: "none",
              border: "none",
              fontSize: "11px",
              color: history.length === 0 ? "#333" : "#D85A30",
              cursor: history.length === 0 ? "not-allowed" : "pointer",
              padding: 0,
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      {storageWarning && (
        <p
          style={{
            fontSize: "11px",
            color: "#BA7517",
            padding: "8px 1rem",
            margin: 0,
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          {storageWarning}
        </p>
      )}

      {history.length === 0 ? (
        <p
          style={{
            fontSize: "12px",
            color: "#444",
            padding: "1rem",
            margin: 0,
          }}
        >
          No analyses yet. Run one above to start building history.
        </p>
      ) : (
        <div style={{ maxHeight: "280px", overflowY: "auto" }}>
          {history.map((entry) => {
            const isActive = entry.id === activeId;
            const level = entry.severity?.level || "Unknown";
            const color = entry.severity?.color || "#555";

            return (
              <div
                key={entry.id}
                onClick={() => onSelect(entry)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 1rem",
                  borderBottom: "1px solid #202020",
                  background: isActive ? "#04342C22" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#e0e0e0",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.filename}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#444",
                      fontFamily: "monospace",
                      margin: "2px 0 0",
                    }}
                  >
                    {formatTimestamp(entry.timestamp)} · {entry.total_logs} logs
                    · {entry.alert_count} alerts
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "500",
                      color: color,
                      padding: "2px 10px",
                      borderRadius: "20px",
                      border: `1px solid ${color}55`,
                    }}
                  >
                    {level}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    }}
                    title="Delete entry"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#444",
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "0 4px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
