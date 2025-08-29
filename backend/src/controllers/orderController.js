import pool from "../models/db.js";

export async function createOrder(req, res) {
  const { items, event_id } = req.body;
  // items: [{ticket_type_id, qty}]
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: "Items kosong" });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Ambil harga + stok
    const ids = items.map((i) => i.ticket_type_id);
    const [ticketRows] = await conn.query(`SELECT * FROM ticket_types WHERE id IN (${ids.map(() => "?").join(",")}) FOR UPDATE`, ids);
    // Validasi kuota
    let total = 0;
    for (const it of items) {
      const t = ticketRows.find((r) => r.id == it.ticket_type_id);
      if (!t) throw new Error("Tipe tiket tidak ditemukan");
      if (it.qty <= 0) throw new Error("Qty invalid");
      if (t.quota < it.qty) throw new Error(`Kuota tidak cukup untuk ${t.name}`);
      total += t.price * it.qty;
    }
    // Buat order
    const [orderRes] = await conn.query("INSERT INTO orders (user_id, event_id, total_amount, status) VALUES (?, ?, ?, 'PAID')", [req.user.id, event_id || ticketRows[0].event_id, total]);
    const orderId = orderRes.insertId;
    // Insert items + kurangi stok
    for (const it of items) {
      const t = ticketRows.find((r) => r.id == it.ticket_type_id);
      await conn.query("INSERT INTO order_items (order_id, ticket_type_id, qty, unit_price) VALUES (?,?,?,?)", [orderId, it.ticket_type_id, it.qty, t.price]);
      await conn.query("UPDATE ticket_types SET quota = quota - ? WHERE id = ?", [it.qty, it.ticket_type_id]);
    }
    await conn.commit();
    res.status(201).json({ id: orderId, total, status: "PAID" });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(400).json({ message: e.message || "Gagal membuat order" });
  } finally {
    conn.release();
  }
}

export async function myOrders(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, e.name as event_name
       FROM orders o
       JOIN events e ON e.id = o.event_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Gagal mengambil order" });
  }
}
