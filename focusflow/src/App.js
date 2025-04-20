import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TimerPage from "./pages/Timer"; // Import TimerPage

const App = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* No global navbar here, only conditionally show buttons when needed */}
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/timer"
          element={<TimerPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
