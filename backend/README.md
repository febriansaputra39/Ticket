# Ticketing Backend (Node.js + Express + MySQL)

## Cara jalanin
1. Duplikat file `.env.example` menjadi `.env` dan sesuaikan variabelnya.
2. Import SQL: `db/ticketingdb.sql` ke MySQL kamu.
3. Install deps: `npm install`
4. Jalanin dev server: `npm run dev` (port default 5001).

## Struktur
- `src/models/db.js` -> koneksi MySQL
- `src/middleware/auth.js` -> verifikasi JWT
- `src/routes/*.js` -> routing REST API
- `src/controllers/*.js` -> handler logika
- `src/server.js` -> bootstrap Express
- `db/ticketingdb.sql` -> schema + seed data

## Endpoint ringkas
- `POST /api/auth/register` {name,email,password}
- `POST /api/auth/login` {email,password}
- `GET /api/events` -> daftar event + tiket
- `GET /api/events/:id` -> detail event + tiket
- `POST /api/orders` (auth) -> buat order
- `GET /api/orders/me` (auth) -> daftar order milik user
