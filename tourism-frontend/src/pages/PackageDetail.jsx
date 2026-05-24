import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PackageDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pkg,     setPkg]     = useState(null);
  const [form,    setForm]    = useState({ travel_date:'', num_persons:1 });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/packages/${id}`).then(({ data }) => setPkg(data));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/bookings/package', {
        package_id: id, travel_date: form.travel_date, num_persons: form.num_persons,
      });
      navigate('/payment', {
        state: { booking_id: data.booking_id, amount: data.total_price, type: 'package' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return <p style={{ textAlign:'center', marginTop:'60px' }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{pkg.title}</h2>
        <div style={styles.badges}>
          <span style={styles.badge}>📍 {pkg.destination}</span>
          <span style={styles.badge}>⏱ {pkg.duration_days} days</span>
          <span style={styles.badge}>💺 {pkg.available_seats} seats left</span>
        </div>
        <p style={styles.desc}>{pkg.description}</p>
        <p style={styles.price}>₹{Number(pkg.price).toLocaleString('en-IN')}
          <span style={{ fontSize:'14px', fontWeight:'normal' }}> / person</span>
        </p>
        <hr />
        <h3>Book This Package</h3>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>Travel Date</label>
        <input style={styles.input} type="date"
               min={new Date().toISOString().split('T')[0]}
               onChange={e => setForm({...form, travel_date: e.target.value})} required />
        <label style={styles.label}>Number of Persons</label>
        <input style={styles.input} type="number" min="1" max={pkg.available_seats}
               value={form.num_persons}
               onChange={e => setForm({...form, num_persons: Number(e.target.value)})} />
        <p><strong>Total: ₹{(pkg.price * form.num_persons).toLocaleString('en-IN')}</strong></p>
        <button style={styles.btn} onClick={handleBook}
                disabled={loading || !form.travel_date}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page:   { maxWidth:'680px', margin:'0 auto', padding:'32px 16px' },
  card:   { background:'#fff', borderRadius:'12px', padding:'32px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' },
  title:  { color:'#1a73e8', marginBottom:'12px' },
  badges: { display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'16px' },
  badge:  { background:'#e8f0fe', color:'#1a73e8', padding:'4px 12px', borderRadius:'20px', fontSize:'13px' },
  desc:   { color:'#555', lineHeight:'1.7', marginBottom:'16px' },
  price:  { fontSize:'28px', fontWeight:'bold', color:'#e65100', margin:'16px 0' },
  label:  { display:'block', marginBottom:'4px', fontWeight:'500', fontSize:'14px' },
  input:  { width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'16px', fontSize:'15px', boxSizing:'border-box' },
  btn:    { width:'100%', padding:'12px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', fontWeight:'bold', cursor:'pointer' },
  error:  { background:'#fdecea', color:'#c62828', padding:'10px', borderRadius:'6px', marginBottom:'12px', fontSize:'14px' },
};