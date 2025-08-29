import pool from "../models/db.js";

export async function listEvents(req, res) {
  try {
    const [events] = await pool.query("SELECT * FROM events ORDER BY date ASC");
    const [tickets] = await pool.query("SELECT * FROM ticket_types");
    const grouped = events.map((ev) => ({
      ...ev,
      tickets: tickets.filter((t) => t.event_id === ev.id),
    }));
    res.json(grouped);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Gagal mengambil event" });
  }
}

export async function getEvent(req, res) {
  try {
    const id = req.params.id;
    const [events] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    if (!events.length) return res.status(404).json({ message: "Event tidak ditemukan" });
    const event = events[0];
    const [tickets] = await pool.query("SELECT * FROM ticket_types WHERE event_id = ?", [id]);
    res.json({ ...event, tickets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Gagal mengambil detail event" });
  }
}
