const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../petstore.db');

const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const initDB = async () => {
  db.serialize(async () => {
    // Users table (Admin, Staff/Technician, Customer)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Pets table with Health Care Record
    db.run(`
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'dog',
        breed TEXT,
        age INTEGER,
        weight REAL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Services table (Pure Pet Services)
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        duration_mins INTEGER DEFAULT 60,
        category TEXT NOT NULL DEFAULT 'grooming',
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table for internal service supplies
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL DEFAULT 'supply',
        stock INTEGER DEFAULT 10,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Service Bookings table (with Assigned Staff & Room Number)
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pet_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        booking_date TEXT NOT NULL,
        booking_time TEXT NOT NULL,
        assigned_staff TEXT DEFAULT 'Chưa phân công',
        room_number TEXT DEFAULT 'N/A',
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (pet_id) REFERENCES pets(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

    // Seed Data
    setTimeout(async () => {
      try {
        const userCount = await get('SELECT COUNT(*) as count FROM users');
        if (userCount && userCount.count === 0) {
          const adminPassword = await bcrypt.hash('admin123', 10);
          const customerPassword = await bcrypt.hash('customer123', 10);

          await run(
            `INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Quản Trị Viên Dịch Vụ', 'admin@petcare.com', adminPassword, 'admin', '0988776655', '123 Nguyễn Trãi, Hà Nội']
          );

          const customerRes = await run(
            `INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Nguyễn Văn An (Khách Hàng)', 'customer@gmail.com', customerPassword, 'customer', '0912345678', '456 Cầu Giấy, Hà Nội']
          );

          const petRes1 = await run(
            `INSERT INTO pets (user_id, name, type, breed, age, weight, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [customerRes.id, 'Cún Poodle Bông', 'dog', 'Poodle Mini', 2, 4.5, 'Lông xù nhẹ, da nhạy cảm cần dùng sữa tắm thảo dược. Đã tiêm vắc xin 7 bệnh.']
          );

          const petRes2 = await run(
            `INSERT INTO pets (user_id, name, type, breed, age, weight, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [customerRes.id, 'Mèo Miu Miu', 'cat', 'Mèo Anh Lông Ngắn', 1, 3.2, 'Ngoan hiền, thích gãi cằm. Lịch cắt tỉa móng định kỳ 2 tuần/lần.']
          );

          // Seed Pet Services
          const service1 = await run(
            `INSERT INTO services (name, description, price, duration_mins, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Combo Tắm Spa & Cắt Tạo Kiểu Poodle', 'Gói dịch vụ cắt tỉa tạo kiểu Poodle chuyên nghiệp: Tắm sấy thảo dược, vệ sinh tai, vắt tuyến hôi, cắt tỉa tạo dáng nấm/bo tròn.', 280000, 90, 'grooming', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600']
          );

          const service2 = await run(
            `INSERT INTO services (name, description, price, duration_mins, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Khách Sạn Thú Cưng Phòng VIP (1 Ngày)', 'Lưu trú phòng máy lạnh 24/7, camera livestream cho chủ xem, 3 bữa ăn hạt dinh dưỡng Royal Canin, khu vui chơi sảnh mở.', 220000, 1440, 'hotel', 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=600']
          );

          await run(
            `INSERT INTO services (name, description, price, duration_mins, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Gói Khám Tổng Quát & Tiêm Vắc-Xin 7 Bệnh', 'Khám sức khỏe tai mũi họng, nghe nhịp tim, siêu âm định kỳ và tiêm vắc-xin 7 bệnh nguy hiểm cho chó mèo.', 350000, 45, 'health', 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=600']
          );

          await run(
            `INSERT INTO services (name, description, price, duration_mins, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Gói Vệ Sinh Răng Miệng & Lấy Cao Răng', 'Lấy cao răng sóng siêu âm không đau, xịt thơm miệng diệt khuẩn cho thú cưng.', 160000, 30, 'bath', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600']
          );

          await run(
            `INSERT INTO services (name, description, price, duration_mins, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Tắm Sấy & Vệ Sinh Tai Chó Mèo Nhỏ', 'Tắm sấy khô, chải lông rụng, vệ sinh làm sạch tai và cắt móng chân an toàn.', 150000, 45, 'bath', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600']
          );

          // Seed Internal Supplies
          await run(
            `INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Sữa Tắm Thảo Dược Joy Spa (Internal Use)', 'Dụng cụ tắm phục vụ dịch vụ spa thú cưng', 180000, 'supply', 30, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600']
          );

          // Seed Sample Service Bookings
          const today = new Date().toISOString().split('T')[0];
          await run(
            `INSERT INTO bookings (user_id, pet_id, service_id, booking_date, booking_time, assigned_staff, room_number, notes, status, total_price) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customerRes.id, petRes1.id, service1.id, today, '09:30', 'Kỹ thuật viên KTV Hoàng', 'Khu Grooming 01', 'Cắt tạo kiểu tròn mặt, sấy xù nhẹ', 'received', 280000]
          );

          await run(
            `INSERT INTO bookings (user_id, pet_id, service_id, booking_date, booking_time, assigned_staff, room_number, notes, status, total_price) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customerRes.id, petRes2.id, service2.id, today, '14:00', 'NV Bảo An', 'Phòng VIP-102', 'Lưu trú 2 ngày, cho ăn pate cá hồi', 'confirmed', 220000]
          );

          console.log('✅ SQLite Database Re-Seeded for Pet Service Management System!');
        }
      } catch (err) {
        console.error('Error seeding DB:', err);
      }
    }, 100);
  });
};

module.exports = { db, run, get, all, initDB };
