const db = require('../config/db');

// GET /api/packages            — list all active packages
exports.getAllPackages = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM tour_packages WHERE status = 'active' ORDER BY created_at DESC"
  );
  res.json(rows);
};

// GET /api/packages/:id
exports.getPackageById = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM tour_packages WHERE package_id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Package not found' });
  res.json(rows[0]);
};

// POST /api/packages           — admin only
exports.createPackage = async (req, res) => {
  const { title, description, price, duration_days, destination, available_seats } = req.body;
  const [result] = await db.query(
    'INSERT INTO tour_packages (title, description, price, duration_days, destination, available_seats) VALUES (?,?,?,?,?,?)',
    [title, description, price, duration_days, destination, available_seats]
  );
  res.status(201).json({ message: 'Package created', package_id: result.insertId });
};

// PUT /api/packages/:id        — admin only
exports.updatePackage = async (req, res) => {
  const { title, description, price, duration_days, destination, available_seats, status } = req.body;
  await db.query(
    'UPDATE tour_packages SET title=?, description=?, price=?, duration_days=?, destination=?, available_seats=?, status=? WHERE package_id=?',
    [title, description, price, duration_days, destination, available_seats, status, req.params.id]
  );
  res.json({ message: 'Package updated' });
};

// DELETE /api/packages/:id     — admin only
exports.deletePackage = async (req, res) => {
  await db.query('DELETE FROM tour_packages WHERE package_id = ?', [req.params.id]);
  res.json({ message: 'Package deleted' });
};