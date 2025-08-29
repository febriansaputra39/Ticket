import React, { useState } from "react";
import { api } from "../api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.register(name, email, password);
      alert("Registrasi berhasil! Silakan login.");
      nav("/login");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h3>Register</h3>
      {error && <div className="small">Error: {error}</div>}
      <form className="stack" onSubmit={submit}>
        <label className="label">Nama</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn" type="submit">
          Daftar
        </button>
        <div className="small">
          Sudah punya akun?{" "}
          <Link className="link" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
