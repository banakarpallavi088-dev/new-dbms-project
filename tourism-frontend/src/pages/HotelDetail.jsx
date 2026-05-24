import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function HotelDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotel,   setHotel]   = useState(null);
  const [form,    setForm]    = useState({ room_id:'', check_in:'', check_out:'' });
  const [nights,  setNights]  = useState(0);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/hotels/${id}`).then(({ data }) => setHotel(data));
  }, [id]);

  useEffect(() => {
    if (form.check_in && form.check_out) {
      const diff = (new Date(form.check_out) - new Date(form.check_in)) / (1000*60*60*24);
      setNights(diff > 0 ? diff : 0);
    }
  }, [form.check_in, form.check_out]);

  const selectedRoom = hotel?.rooms?.find(r => r.room_id === Number(form.room_id));

  const handleBook = async () => {
    if (!user) return navigate('/login');
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/bookings/hotel', {
        room_id: form.room_id, check_in: form.check_in, check_out: form.check_out,
      });
      navigate('/payment', {
        state: { hotel_booking_id: data.hotel_booking_id, amount: data.total_price, type: 'hotel' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) return <p style={{ textAlign:'center', marginTop:'60px' }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{hotel.name}</h2>
        <p>📍 {hotel.address}, {hotel.city} &nbsp;|&nbsp; ⭐ {hotel.rating} / 5</p>
        <hr />
        <h3>Available Rooms</h3>
        <div style={styles.roomGrid}>
          {hotel.rooms.map(r => (
            <div key={r.room_id}
                 style={{ ...styles.roomCard, border: form.room_id == r.room_id ? '2px solid #1a73e8' : '1px solid #ddd' }}
                 onClick={() => setForm({...form, room_id: r.room_id})}>
              <strong style={{ textTransform:'capitalize' }}>{r.room_type}</strong>
              <p>₹{Number(r.price_per_night).toLocaleString('en-IN')} / night</p>
              <p style={{ color: r.availability > 0 ? 'green' : 'red' }}>
                {r.availability > 0 ? `${r.availability} available` : 'Not available'}
              </p>
            </div>
          ))}
        </div>
        <hr />
        <h3>Book a Room</h3>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>Check-in Date</label>
        <input style={styles.input} type="date"
               min={new Date().toISOString().split('T')[0]}
               onChange={e => setForm({...form, check_in: e.target.value})} />
        <label style={styles.label}>Check-out Date</label>
        <input style={styles.input} type="date"
               min={form.check_in || new Date().toISOString().split('T')[0]}
               onChange={e => setForm({...form, check_out: e.target.value})} />
        {selectedRoom && nights > 0 && (
          <p><strong>Total: ₹{(selectedRoom.price_per_night * nights).toLocaleString('en-IN')} ({nights} nights)</strong></p>
        )}
        <button style={styles.btn} onClick={handleBook}
                disabled={loading || !form.room_id || !form.check_in || !form.check_out || nights < 1}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page:     { maxWidth:'720px', margin:'0 auto', padding:'32px 16px' },
  card:     { background:'#fff', borderRadius:'12px', padding:'32px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' },
  title:    { color:'#1a73e8' },
  roomGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'12px', margin:'16px 0' },
  roomCard: { padding:'14px', borderRadius:'8px', cursor:'pointer', textAlign:'center' },
  label:    { display:'block', marginBottom:'4px', fontWeight:'500', fontSize:'14px' },
  input:    { width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'16px', fontSize:'15px', boxSizing:'border-box' },
  btn:      { width:'100%', padding:'12px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', fontWeight:'bold', cursor:'pointer' },
  error:    { background:'#fdecea', color:'#c62828', padding:'10px', borderRadius:'6px', marginBottom:'12px' },
};