import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib" });
    }
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email sudah terdaftar" });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, hash]);
    return res.status(201).json({ id: result.insertId, name, email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Gagal register" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ message: "Email tidak ditemukan" });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: "Password salah" });
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "supersecretjwt", {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    });
    res.json({ token, user: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Gagal login" });
  }
}
