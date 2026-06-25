import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RuleEditor from "./pages/RuleEditor";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rules" element={<RuleEditor />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
