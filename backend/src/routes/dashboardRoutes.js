const express = require('express');
const router = express.Router();
const { get, all } = require('../db/db');
const { verifyAdmin } = require('../middleware/auth');

router.get('/summary', verifyAdmin, async (req, res) => {
  try {
    const totalCustomers = await get("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
    const totalPets = await get("SELECT COUNT(*) as count FROM pets");
    const totalBookings = await get("SELECT COUNT(*) as count FROM bookings");
    const pendingBookings = await get("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    const completedBookings = await get("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'");
    const totalRevenue = await get("SELECT SUM(total_price) as total FROM bookings WHERE status = 'completed'");

    const activeHotelPets = await get(`
      SELECT COUNT(*) as count 
      FROM bookings 
      JOIN services ON bookings.service_id = services.id
      WHERE services.category = 'hotel' AND bookings.status IN ('confirmed', 'in_progress')
    `);

    const lowStockProducts = await get("SELECT COUNT(*) as count FROM products WHERE stock < 10");

    const recentBookings = await all(`
      SELECT bookings.*, users.name as customer_name, pets.name as pet_name, services.name as service_name
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN pets ON bookings.pet_id = pets.id
      JOIN services ON bookings.service_id = services.id
      ORDER BY bookings.id DESC
      LIMIT 5
    `);

    res.json({
      total_customers: totalCustomers?.count || 0,
      total_pets: totalPets?.count || 0,
      total_bookings: totalBookings?.count || 0,
      pending_bookings: pendingBookings?.count || 0,
      completed_bookings: completedBookings?.count || 0,
      total_revenue: totalRevenue?.total || 0,
      active_hotel_pets: activeHotelPets?.count || 0,
      low_stock_products: lowStockProducts?.count || 0,
      recent_bookings: recentBookings || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin tổng quan admin', error: err.message });
  }
});

module.exports = router;
