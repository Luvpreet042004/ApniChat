import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import ChangePassword from "./pages/ChangePassword";
import DeleteUser from "./pages/DeleteUser";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update" element={<ChangePassword />} />
        <Route path="/delete" element={<DeleteUser />} />
        <Route path="*" element={<SignIn />} /> {/* Default to SignIn */}
      </Routes>
    </Router>
  );
};

export default App;
