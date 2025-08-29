-- Buat database
CREATE DATABASE IF NOT EXISTS ticketingdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ticketingdb;

-- Tabel users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  banner_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel ticket_types
DROP TABLE IF EXISTS ticket_types;
CREATE TABLE ticket_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(100) NOT NULL, -- e.g. "Regular", "VIP"
  price DECIMAL(12,2) NOT NULL,
  quota INT NOT NULL DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel orders
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status ENUM('PENDING','PAID','CANCELLED') DEFAULT 'PAID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel order_items
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  ticket_type_id INT NOT NULL,
  qty INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed data events + tickets
INSERT INTO events (name, description, date, location, banner_url) VALUES
('Konser Musik Rock', 'Konser musik rock dengan band lokal dan internasional', '2025-09-15 19:00:00', 'Stadion Utama', 'https://picsum.photos/seed/rock/1200/400'),
('Tech Conference 2025', 'Konferensi teknologi tahunan', '2025-10-20 09:00:00', 'Convention Center', 'https://picsum.photos/seed/tech/1200/400'),
('Stand-up Comedy Night', 'Malam tawa bersama komika favorit', '2025-11-05 20:00:00', 'Teater Kota', 'https://picsum.photos/seed/comedy/1200/400');

INSERT INTO ticket_types (event_id, name, price, quota) VALUES
(1, 'Regular', 150000.00, 200),
(1, 'VIP', 350000.00, 50),
(2, 'Early Bird', 250000.00, 100),
(2, 'Standard', 300000.00, 300),
(3, 'General', 120000.00, 150);
