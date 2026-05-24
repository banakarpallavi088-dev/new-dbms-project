const db = require('../config/db');

// POST /api/bookings/package
exports.bookPackage = async (req, res) => {
  const { package_id, travel_date, num_persons } = req.body;
  const user_id = req.user.user_id;
  try {
    const [pkg] = await db.query('SELECT * FROM tour_packages WHERE package_id = ?', [package_id]);
    if (!pkg.length || pkg[0].status !== 'active')
      return res.status(400).json({ message: 'Package not available' });
    if (pkg[0].available_seats < num_persons)
      return res.status(400).json({ message: 'Not enough seats available' });

    const total_price = pkg[0].price * num_persons;
    const [result] = await db.query(
      'INSERT INTO package_bookings (user_id, package_id, travel_date, num_persons, total_price) VALUES (?,?,?,?,?)',
      [user_id, package_id, travel_date, num_persons, total_price]
    );
    await db.query(
      'UPDATE tour_packages SET available_seats = available_seats - ? WHERE package_id = ?',
      [num_persons, package_id]
    );
    res.status(201).json({ message: 'Package booked', booking_id: result.insertId, total_price });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/bookings/hotel
exports.bookHotel = async (req, res) => {
  const { room_id, check_in, check_out } = req.body;
  const user_id = req.user.user_id;
  try {
    const [room] = await db.query('SELECT * FROM rooms WHERE room_id = ?', [room_id]);
    if (!room.length || room[0].availability < 1)
      return res.status(400).json({ message: 'Room not available' });

    const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
    const total_price = room[0].price_per_night * nights;

    const [result] = await db.query(
      'INSERT INTO hotel_bookings (user_id, room_id, check_in, check_out, total_price) VALUES (?,?,?,?,?)',
      [user_id, room_id, check_in, check_out, total_price]
    );
    await db.query('UPDATE rooms SET availability = availability - 1 WHERE room_id = ?', [room_id]);
    res.status(201).json({ message: 'Hotel booked', hotel_booking_id: result.insertId, total_price });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/bookings/my          — all bookings for logged-in user
exports.getMyBookings = async (req, res) => {
  const user_id = req.user.user_id;
  const [pkgBookings]   = await db.query(
    `SELECT pb.*, tp.title, tp.destination FROM package_bookings pb
     JOIN tour_packages tp ON pb.package_id = tp.package_id
     WHERE pb.user_id = ? ORDER BY pb.booked_at DESC`, [user_id]
  );
  const [hotelBookings] = await db.query(
    `SELECT hb.*, r.room_type, h.name AS hotel_name FROM hotel_bookings hb
     JOIN rooms r ON hb.room_id = r.room_id
     JOIN hotels h ON r.hotel_id = h.hotel_id
     WHERE hb.user_id = ? ORDER BY hb.booked_at DESC`, [user_id]
  );
  res.json({ package_bookings: pkgBookings, hotel_bookings: hotelBookings });
};

// PUT /api/bookings/package/:id/cancel
exports.cancelPackageBooking = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM package_bookings WHERE booking_id = ? AND user_id = ?',
    [req.params.id, req.user.user_id]
  );
  if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
  if (rows[0].status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

  await db.query("UPDATE package_bookings SET status='cancelled' WHERE booking_id=?", [req.params.id]);
  await db.query(
    'UPDATE tour_packages SET available_seats = available_seats + ? WHERE package_id = ?',
    [rows[0].num_persons, rows[0].package_id]
  );
  res.json({ message: 'Booking cancelled' });
};