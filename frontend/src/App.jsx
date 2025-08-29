import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Orders from "./pages/Orders.jsx";
import { getToken, logout } from "./api.js";

export default function App() {
  const authed = !!getToken();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="container">
      <nav className="nav">
        <div className="row nav-menu">
          <span className="brand">🎟️ Event Ticketing</span>
          <Link className={isActive("/")} to="/">
            Events
          </Link>
          {authed && (
            <Link className={isActive("/orders")} to="/orders">
              My Orders
            </Link>
          )}
        </div>

        <div className="row nav-menu">
          {!authed ? (
            <>
              <Link className={isActive("/login")} to="/login">
                Login
              </Link>
              <Link className={isActive("/register")} to="/register">
                Register
              </Link>
            </>
          ) : (
            <button
              className="btn-logout"
              onClick={() => {
                logout();
                location.href = "/";
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={!authed ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!authed ? <Register /> : <Navigate to="/" />} />
        <Route path="/orders" element={authed ? <Orders /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
