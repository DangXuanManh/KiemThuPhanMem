const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/my-pets', verifyToken, async (req, res) => {
  try {
    const pets = await all('SELECT * FROM pets WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thú cưng', error: err.message });
  }
});

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const pets = await all(`
      SELECT pets.*, users.name as owner_name, users.phone as owner_phone, users.email as owner_email
      FROM pets 
      JOIN users ON pets.user_id = users.id 
      ORDER BY pets.id DESC
    `);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tất cả thú cưng', error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, type, breed, age, weight, notes } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Tên thú cưng là bắt buộc!' });
    }

    const result = await run(
      `INSERT INTO pets (user_id, name, type, breed, age, weight, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, type || 'dog', breed || '', age || 1, weight || 1.0, notes || '']
    );

    const newPet = await get('SELECT * FROM pets WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Thêm thú cưng thành công!', pet: newPet });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thêm thú cưng', error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await get('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    if (!pet) {
      return res.status(404).json({ message: 'Không tìm thấy thú cưng!' });
    }

    if (pet.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa thú cưng này!' });
    }

    const { name, type, breed, age, weight, notes } = req.body;
    await run(
      `UPDATE pets SET name=?, type=?, breed=?, age=?, weight=?, notes=? WHERE id=?`,
      [name || pet.name, type || pet.type, breed || pet.breed, age || pet.age, weight || pet.weight, notes || pet.notes, req.params.id]
    );

    const updated = await get('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cập nhật thú cưng thành công!', pet: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thú cưng', error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await get('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    if (!pet) {
      return res.status(404).json({ message: 'Không tìm thấy thú cưng!' });
    }

    if (pet.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa thú cưng này!' });
    }

    await run('DELETE FROM pets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thú cưng thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa thú cưng', error: err.message });
  }
});

module.exports = router;
