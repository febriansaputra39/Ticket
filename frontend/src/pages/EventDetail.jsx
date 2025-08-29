import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, getToken } from "../api.js";

export default function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [cart, setCart] = useState({}); // ticket_type_id => qty
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    api
      .event(id)
      .then(setEv)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="card">Error: {error}</div>;
  if (!ev) return <div className="card">Memuat detail...</div>;

  const total = ev.tickets.reduce((sum, t) => sum + (cart[t.id] || 0) * Number(t.price), 0);

  const updateQty = (tid, v) => {
    setCart((c) => ({ ...c, [tid]: Math.max(0, v) }));
  };

  const checkout = async () => {
    if (!getToken()) return nav("/login");
    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([ticket_type_id, qty]) => ({ ticket_type_id: Number(ticket_type_id), qty }));
    if (!items.length) return alert("Pilih minimal 1 tiket");
    try {
      const res = await api.createOrder({ event_id: ev.id, items });
      alert("Order berhasil! Total: Rp" + Number(res.total).toLocaleString("id-ID"));
      nav("/orders");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="card">
      {ev.banner_url && <img className="header-banner" src={ev.banner_url} alt={ev.name} />}
      <div className="h1">{ev.name}</div>
      <div className="small">{new Date(ev.date).toLocaleString()}</div>
      <div className="small">📍 {ev.location}</div>
      <p>{ev.description}</p>
      <div className="grid">
        {ev.tickets.map((t) => (
          <div key={t.id} className="card">
            <h3>{t.name}</h3>
            <div className="price">Rp{Number(t.price).toLocaleString("id-ID")}</div>
            <div className="small">Sisa kuota: {t.quota}</div>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => updateQty(t.id, (cart[t.id] || 0) - 1)}>
                -
              </button>
              <div className="badge">Qty: {cart[t.id] || 0}</div>
              <button className="btn" onClick={() => updateQty(t.id, (cart[t.id] || 0) + 1)}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 16, justifyContent: "space-between" }}>
        <div>
          Total: <strong>Rp{Number(total).toLocaleString("id-ID")}</strong>
        </div>
        <button className="btn" onClick={checkout}>
          Checkout
        </button>
      </div>
    </div>
  );
}
