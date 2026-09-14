const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/db');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const services = await all(sql, params);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách dịch vụ', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!service) {
      return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết dịch vụ', error: err.message });
  }
});

router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, duration_mins, category, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Tên dịch vụ và giá là bắt buộc!' });
    }

    const result = await run(
      `INSERT INTO services (name, description, price, duration_mins, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || '', price, duration_mins || 60, category || 'grooming', image || '']
    );

    const newService = await get('SELECT * FROM services WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Thêm dịch vụ thành công!', service: newService });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thêm dịch vụ', error: err.message });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, duration_mins, category, image } = req.body;
    const existing = await get('SELECT id FROM services WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
    }

    await run(
      `UPDATE services SET name=?, description=?, price=?, duration_mins=?, category=?, image=? WHERE id=?`,
      [name, description, price, duration_mins, category, image, req.params.id]
    );

    const updated = await get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cập nhật dịch vụ thành công!', service: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật dịch vụ', error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM services WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ message: 'Dịch vụ không tồn tại!' });
    }

    await run('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa dịch vụ thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa dịch vụ', error: err.message });
  }
});

module.exports = router;
