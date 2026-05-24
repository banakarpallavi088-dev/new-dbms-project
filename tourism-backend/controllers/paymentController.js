const db   = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// POST /api/payments
exports.createPayment = async (req, res) => {
  const { package_booking_id, hotel_booking_id, amount, method } = req.body;
  const user_id        = req.user.user_id;
  const transaction_id = 'TXN' + uuidv4().replace(/-/g,'').toUpperCase().slice(0,12);

  try {
    const [result] = await db.query(
      'INSERT INTO payments (user_id, package_booking_id, hotel_booking_id, amount, method, status, transaction_id) VALUES (?,?,?,?,?,?,?)',
      [user_id, package_booking_id || null, hotel_booking_id || null, amount, method, 'success', transaction_id]
    );

    // Mark the linked booking as confirmed
    if (package_booking_id)
      await db.query("UPDATE package_bookings SET status='confirmed' WHERE booking_id=?", [package_booking_id]);
    if (hotel_booking_id)
      await db.query("UPDATE hotel_bookings SET status='confirmed' WHERE hotel_booking_id=?", [hotel_booking_id]);

    res.status(201).json({ message: 'Payment successful', payment_id: result.insertId, transaction_id });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
};

// GET /api/payments/my
exports.getMyPayments = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY paid_at DESC',
    [req.user.user_id]
  );
  res.json(rows);
};