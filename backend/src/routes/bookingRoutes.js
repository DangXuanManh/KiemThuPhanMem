const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get customer's own service bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await all(`
      SELECT bookings.*, 
             pets.name as pet_name, pets.type as pet_type, pets.breed as pet_breed,
             services.name as service_name, services.duration_mins, services.category as service_category
      FROM bookings
      JOIN pets ON bookings.pet_id = pets.id
      JOIN services ON bookings.service_id = services.id
      WHERE bookings.user_id = ?
      ORDER BY bookings.id DESC
    `, [req.user.id]);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch hẹn dịch vụ cá nhân', error: err.message });
  }
});

// Admin get all service bookings (with optional status & date filter)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, date } = req.query;
    let sql = `
      SELECT bookings.*, 
             users.name as customer_name, users.phone as customer_phone, users.email as customer_email,
             pets.name as pet_name, pets.type as pet_type, pets.breed as pet_breed, pets.weight as pet_weight,
             services.name as service_name, services.duration_mins, services.category as service_category
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN pets ON bookings.pet_id = pets.id
      JOIN services ON bookings.service_id = services.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND bookings.status = ?';
      params.push(status);
    }
    if (date) {
      sql += ' AND bookings.booking_date = ?';
      params.push(date);
    }

    sql += ' ORDER BY bookings.id DESC';
    const bookings = await all(sql, params);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách lịch hẹn dịch vụ', error: err.message });
  }
});

// Create new pet service booking
router.post('/', verifyToken, async (req, res) => {
  try {
    let { pet_id, service_id, booking_date, booking_time, notes, new_pet } = req.body;

    if (!service_id || !booking_date || !booking_time) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Dịch vụ, Ngày và Giờ hẹn!' });
    }

    const service = await get('SELECT * FROM services WHERE id = ?', [service_id]);
    if (!service) {
      return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
    }

    if (!pet_id && new_pet && new_pet.name) {
      const petRes = await run(
        `INSERT INTO pets (user_id, name, type, breed, age, weight, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, new_pet.name, new_pet.type || 'dog', new_pet.breed || '', new_pet.age || 1, new_pet.weight || 1, new_pet.notes || '']
      );
      pet_id = petRes.id;
    }

    if (!pet_id) {
      return res.status(400).json({ message: 'Vui lòng chọn thú cưng hoặc thêm bé mới!' });
    }

    const pet = await get('SELECT * FROM pets WHERE id = ?', [pet_id]);
    if (!pet) {
      return res.status(404).json({ message: 'Thú cưng không tồn tại!' });
    }

    const totalPrice = service.price;

    const result = await run(
      `INSERT INTO bookings (user_id, pet_id, service_id, booking_date, booking_time, notes, status, total_price) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [req.user.id, pet_id, service_id, booking_date, booking_time, notes || '', totalPrice]
    );

    const createdBooking = await get(`
      SELECT bookings.*, 
             pets.name as pet_name, 
             services.name as service_name
      FROM bookings
      JOIN pets ON bookings.pet_id = pets.id
      JOIN services ON bookings.service_id = services.id
      WHERE bookings.id = ?
    `, [result.id]);

    res.status(201).json({
      message: 'Đặt lịch dịch vụ thành công! Cửa hàng đã ghi nhận lịch hẹn.',
      booking: createdBooking
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo lịch hẹn dịch vụ', error: err.message });
  }
});

// Update booking status & staff assignment (Admin action or Customer cancel)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, assigned_staff, room_number } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'received', 'in_service', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái dịch vụ không hợp lệ!' });
    }

    const booking = await get('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn dịch vụ!' });
    }

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa lịch hẹn này!' });
    }

    if (req.user.role !== 'admin' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Khách hàng chỉ có quyền hủy lịch hẹn!' });
    }

    const newStatus = status || booking.status;
    const newStaff = assigned_staff !== undefined ? assigned_staff : booking.assigned_staff;
    const newRoom = room_number !== undefined ? room_number : booking.room_number;

    await run(
      'UPDATE bookings SET status = ?, assigned_staff = ?, room_number = ? WHERE id = ?',
      [newStatus, newStaff, newRoom, req.params.id]
    );

    const updated = await get('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cập nhật trạng thái dịch vụ thành công!', booking: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái dịch vụ', error: err.message });
  }
});

module.exports = router;
