import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Orders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil pesanan
  const fetchOrders = () => {
    setLoading(true);
    api
      .myOrders()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hapus order
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus pesanan ini?")) return;
    try {
      await api.deleteOrder(id); // panggil API backend
      fetchOrders(); // refresh data setelah hapus
    } catch (err) {
      alert("Gagal hapus: " + err.message);
    }
  };

  if (loading) return <div className="card center">Memuat orders...</div>;

  if (error) return <div className="card center">Error: {error}</div>;

  return (
    <div className="card">
      <h3>Pesanan Saya</h3>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Event</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="center">
                Belum ada pesanan.
              </td>
            </tr>
          ) : (
            rows.map((r, index) => (
              <tr key={r.id}>
                <td>#{index + 1}</td>
                <td>{r.event_name}</td>
                <td>Rp{Number(r.total_amount).toLocaleString("id-ID")}</td>
                <td>{r.status}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn-hapus" onClick={() => handleDelete(r.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
