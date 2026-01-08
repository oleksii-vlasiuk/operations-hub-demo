// src/App.tsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./core/layout/AppLayout";
import HomePage from "./core/layout/HomePage";
import UsersPage from "./modules/users/pages/UsersPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
