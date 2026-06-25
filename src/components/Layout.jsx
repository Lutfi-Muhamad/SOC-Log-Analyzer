import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          marginLeft: "220px",
          flex: 1,
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
