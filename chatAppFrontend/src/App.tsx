import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import ChangePassword from "./pages/ChangePassword";
import DeleteUser from "./pages/DeleteUser";
import Dashboard from "./pages/Dashboard";
import SocketProvider from "./context/SocketProvider";
import ChatRoom from "./pages/ChatRoom";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update" element={<ChangePassword />} />
        <Route path="/delete" element={<DeleteUser />} />
        <Route
          path="/dashboard"
          element={
            <SocketProvider>
              <Dashboard />
            </SocketProvider>
          }
        />
        <Route
  path="/dashboard/chat/:smaller/:larger"
  element={
    <SocketProvider>
      <ChatRoom />
    </SocketProvider>
  }
/>
        <Route path="*" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
