import React, { useState } from "react";
import { api, setToken } from "../api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      nav("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h3>Login</h3>
      {error && <div className="small">Error: {error}</div>}
      <form className="stack" onSubmit={submit}>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn" type="submit">
          Masuk
        </button>
        <div className="small">
          Belum punya akun?{" "}
          <Link className="link" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
