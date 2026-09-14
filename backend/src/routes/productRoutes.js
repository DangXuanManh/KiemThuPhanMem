const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/db');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
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
    const products = await all(sql, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết sản phẩm', error: err.message });
  }
});

router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Tên sản phẩm và giá là bắt buộc!' });
    }

    const result = await run(
      `INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || '', price, category || 'food', stock || 10, image || '']
    );

    const newProduct = await get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Thêm sản phẩm thành công!', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thêm sản phẩm', error: err.message });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }

    await run(
      `UPDATE products SET name=?, description=?, price=?, category=?, stock=?, image=? WHERE id=?`,
      [name, description, price, category, stock, image, req.params.id]
    );

    const updated = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cập nhật sản phẩm thành công!', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật sản phẩm', error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }

    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa sản phẩm thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa sản phẩm', error: err.message });
  }
});

module.exports = router;
