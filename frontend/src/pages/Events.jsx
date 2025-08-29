import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .events()
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Memuat events...</div>;
  if (error) return <div className="card">Error: {error}</div>;

  return (
    <div className="grid">
      {events.map((ev) => (
        <div key={ev.id} className="card">
          {ev.banner_url && <img className="header-banner" src={ev.banner_url} alt={ev.name} />}
          <h3>{ev.name}</h3>
          <div className="small">{new Date(ev.date).toLocaleString()}</div>
          <div className="small">📍 {ev.location}</div>
          <div className="row" style={{ margin: "8px 0" }}>
            {ev.tickets.map((t) => (
              <span key={t.id} className="badge">
                {t.name} · <span className="price">Rp{Number(t.price).toLocaleString("id-ID")}</span>
              </span>
            ))}
          </div>
          <Link className="btn" to={`/events/${ev.id}`}>
            Lihat Detail
          </Link>
        </div>
      ))}
    </div>
  );
}
