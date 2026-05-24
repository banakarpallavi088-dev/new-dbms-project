const db = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/hotels
// List all hotels (public)
// ─────────────────────────────────────────────
exports.getAllHotels = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM hotels ORDER BY rating DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/hotels/:id
// Get one hotel with all its rooms (public)
// ─────────────────────────────────────────────
exports.getHotelById = async (req, res) => {
  try {
    const [hotel] = await db.query(
      'SELECT * FROM hotels WHERE hotel_id = ?',
      [req.params.id]
    );
    if (!hotel.length)
      return res.status(404).json({ message: 'Hotel not found' });

    const [rooms] = await db.query(
      'SELECT * FROM rooms WHERE hotel_id = ?',
      [req.params.id]
    );

    res.json({ ...hotel[0], rooms });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/hotels
// Create a hotel (admin only)
// ─────────────────────────────────────────────
exports.createHotel = async (req, res) => {
  const { name, address, city, rating, contact_email } = req.body;
  try {
    if (!name || !address || !city)
      return res.status(400).json({ message: 'name, address, and city are required' });

    const [result] = await db.query(
      'INSERT INTO hotels (name, address, city, rating, contact_email) VALUES (?, ?, ?, ?, ?)',
      [name, address, city, rating || null, contact_email || null]
    );
    res.status(201).json({ message: 'Hotel created', hotel_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/hotels/:id
// Update hotel details (admin only)
// ─────────────────────────────────────────────
exports.updateHotel = async (req, res) => {
  const { name, address, city, rating, contact_email } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT hotel_id FROM hotels WHERE hotel_id = ?',
      [req.params.id]
    );
    if (!existing.length)
      return res.status(404).json({ message: 'Hotel not found' });

    await db.query(
      `UPDATE hotels
          SET name = ?, address = ?, city = ?, rating = ?, contact_email = ?
        WHERE hotel_id = ?`,
      [name, address, city, rating, contact_email, req.params.id]
    );
    res.json({ message: 'Hotel updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/hotels/:id
// Delete a hotel (admin only)
// Rooms are deleted automatically via ON DELETE CASCADE
// ─────────────────────────────────────────────
exports.deleteHotel = async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT hotel_id FROM hotels WHERE hotel_id = ?',
      [req.params.id]
    );
    if (!existing.length)
      return res.status(404).json({ message: 'Hotel not found' });

    await db.query('DELETE FROM hotels WHERE hotel_id = ?', [req.params.id]);
    res.json({ message: 'Hotel and its rooms deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/hotels/:id/rooms
// Add a room to a hotel (admin only)
// ─────────────────────────────────────────────
exports.addRoom = async (req, res) => {
  const { room_type, price_per_night, availability } = req.body;
  try {
    const [hotel] = await db.query(
      'SELECT hotel_id FROM hotels WHERE hotel_id = ?',
      [req.params.id]
    );
    if (!hotel.length)
      return res.status(404).json({ message: 'Hotel not found' });

    const [result] = await db.query(
      'INSERT INTO rooms (hotel_id, room_type, price_per_night, availability) VALUES (?, ?, ?, ?)',
      [req.params.id, room_type, price_per_night, availability ?? 1]
    );
    res.status(201).json({ message: 'Room added', room_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/hotels/rooms/:room_id
// Update a room (admin only)
// ─────────────────────────────────────────────
exports.updateRoom = async (req, res) => {
  const { room_type, price_per_night, availability } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT room_id FROM rooms WHERE room_id = ?',
      [req.params.room_id]
    );
    if (!existing.length)
      return res.status(404).json({ message: 'Room not found' });

    await db.query(
      `UPDATE rooms
          SET room_type = ?, price_per_night = ?, availability = ?
        WHERE room_id = ?`,
      [room_type, price_per_night, availability, req.params.room_id]
    );
    res.json({ message: 'Room updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/hotels/rooms/:room_id
// Delete a room (admin only)
// ─────────────────────────────────────────────
exports.deleteRoom = async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT room_id FROM rooms WHERE room_id = ?',
      [req.params.room_id]
    );
    if (!existing.length)
      return res.status(404).json({ message: 'Room not found' });

    await db.query('DELETE FROM rooms WHERE room_id = ?', [req.params.room_id]);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/hotels/search?city=Goa&min=1000&max=5000
// Filter hotels by city and room price range (public)
// ─────────────────────────────────────────────
exports.searchHotels = async (req, res) => {
  const { city, min, max } = req.query;
  try {
    let query = `
      SELECT DISTINCT h.*
        FROM hotels h
        JOIN rooms r ON h.hotel_id = r.hotel_id
       WHERE 1 = 1
    `;
    const params = [];

    if (city) {
      query += ' AND h.city LIKE ?';
      params.push(`%${city}%`);
    }
    if (min) {
      query += ' AND r.price_per_night >= ?';
      params.push(Number(min));
    }
    if (max) {
      query += ' AND r.price_per_night <= ?';
      params.push(Number(max));
    }

    query += ' ORDER BY h.rating DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};