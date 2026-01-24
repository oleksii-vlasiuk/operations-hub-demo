import { Routes, Route } from "react-router-dom";
import AppLayout from "./core/layout/AppLayout";
import HomePage from "./core/layout/HomePage";
import UsersPage from "./modules/users/pages/UsersPage";
import AuditPage from "./modules/users/pages/AuditPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/audit" element={<AuditPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
