import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "⬛" },
  { to: "/rules", label: "Rule Editor", icon: "⚙" },
];

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#111",
        borderRight: "1px solid #1f1f1f",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div style={{ marginBottom: "1.5rem", paddingLeft: "8px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: "#e0e0e0",
            margin: 0,
          }}
        >
          Mini SOC
        </p>
        <p
          style={{
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#444",
            margin: 0,
          }}
        >
          Log Analyzer v1
        </p>
      </div>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            textDecoration: "none",
            color: isActive ? "#1D9E75" : "#555",
            background: isActive ? "#04342C33" : "transparent",
            border: isActive ? "1px solid #0F6E5644" : "1px solid transparent",
            transition: "all 0.15s",
          })}
        >
          <span style={{ fontSize: "14px" }}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}

      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid #1f1f1f",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            color: "#1D9E75",
            padding: "4px 8px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#1D9E75",
              display: "inline-block",
              animation: "pulse 1.8s ease-in-out infinite",
            }}
          />
          System online
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
