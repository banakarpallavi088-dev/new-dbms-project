const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
  const [rows] = await db.query(
    "SELECT user_id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
  );
  res.json(rows);
};

exports.getAllBookings = async (req, res) => {
  const [pkg]   = await db.query(
    `SELECT pb.*, u.full_name, tp.title FROM package_bookings pb
     JOIN users u ON pb.user_id = u.user_id
     JOIN tour_packages tp ON pb.package_id = tp.package_id
     ORDER BY pb.booked_at DESC`
  );
  const [hotel] = await db.query(
    `SELECT hb.*, u.full_name, h.name AS hotel_name, r.room_type FROM hotel_bookings hb
     JOIN users u ON hb.user_id = u.user_id
     JOIN rooms r ON hb.room_id = r.room_id
     JOIN hotels h ON r.hotel_id = h.hotel_id
     ORDER BY hb.booked_at DESC`
  );
  res.json({ package_bookings: pkg, hotel_bookings: hotel });
};

exports.getDashboardStats = async (req, res) => {
  const [[{ total_users }]]    = await db.query("SELECT COUNT(*) AS total_users FROM users WHERE role='customer'");
  const [[{ total_packages }]] = await db.query("SELECT COUNT(*) AS total_packages FROM tour_packages");
  const [[{ total_hotels }]]   = await db.query("SELECT COUNT(*) AS total_hotels FROM hotels");
  const [[{ total_revenue }]]  = await db.query("SELECT COALESCE(SUM(amount),0) AS total_revenue FROM payments WHERE status='success'");
  const [[{ pkg_bookings }]]   = await db.query("SELECT COUNT(*) AS pkg_bookings FROM package_bookings");
  const [[{ hotel_bookings }]] = await db.query("SELECT COUNT(*) AS hotel_bookings FROM hotel_bookings");
  res.json({ total_users, total_packages, total_hotels, total_revenue, pkg_bookings, hotel_bookings });
};