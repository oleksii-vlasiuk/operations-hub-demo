// import HomePage from "./core/layout/HomePage";
// // import UsersPage from "./modules/users/pages/userPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./core/layout/HomePage";
import UsersPage from "./modules/users/pages/UsersPage";


function App() {
  return (
    <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
    </Routes>
  )
}

export default App;