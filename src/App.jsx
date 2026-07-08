import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RuleEditor from "./pages/RuleEditor";
import IOCChecker from "./pages/IOCChecker";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rules" element={<RuleEditor />} />
          <Route path="/ioc" element={<IOCChecker />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
