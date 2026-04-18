import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ProtectedRoute from './components/Protectedroute'

function App() {

  return (
    <div>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;