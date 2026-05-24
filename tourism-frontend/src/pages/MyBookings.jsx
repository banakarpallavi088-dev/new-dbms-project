import { useEffect, useState } from 'react';
import API from '../api/axios';
import BookingCard from '../components/BookingCard';

export default function MyBookings() {
  const [data,    setData]    = useState({ package_bookings:[], hotel_bookings:[] });
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('packages');

  useEffect(() => {
    API.get('/bookings/my').then(({ data }) => { setData(data); setLoading(false); });
  }, []);

  const handleCancel = async id => {
    if (!window.confirm('Cancel this booking?')) return;
    await API.put(`/bookings/package/${id}/cancel`);
    setData(d => ({
      ...d,
      package_bookings: d.package_bookings.map(b =>
        b.booking_id === id ? { ...b, status:'cancelled' } : b
      ),
    }));
  };

  if (loading) return <p style={{ textAlign:'center', marginTop:'60px' }}>Loading bookings...</p>;

  return (
    <div style={styles.page}>
      <h2>My Bookings</h2>
      <div style={styles.tabs}>
        {['packages','hotels'].map(t => (
          <button key={t}
                  style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}
                  onClick={() => setTab(t)}>
            {t === 'packages' ? '📦 Tour Packages' : '🏨 Hotel Rooms'}
            <span style={styles.badge}>
              {t === 'packages' ? data.package_bookings.length : data.hotel_bookings.length}
            </span>
          </button>
        ))}
      </div>
      {tab === 'packages' ? (
        data.package_bookings.length === 0 ? <p>No package bookings yet.</p> :
        data.package_bookings.map(b => (
          <div key={b.booking_id}>
            <BookingCard booking={b} type="package" />
            {b.status === 'pending' && (
              <button style={styles.cancelBtn} onClick={() => handleCancel(b.booking_id)}>
                Cancel Booking
              </button>
            )}
          </div>
        ))
      ) : (
        data.hotel_bookings.length === 0 ? <p>No hotel bookings yet.</p> :
        data.hotel_bookings.map(b => <BookingCard key={b.hotel_booking_id} booking={b} type="hotel" />)
      )}
    </div>
  );
}

const styles = {
  page:      { maxWidth:'800px', margin:'0 auto', padding:'32px 16px' },
  tabs:      { display:'flex', gap:'12px', marginBottom:'24px', borderBottom:'2px solid #eee', paddingBottom:'12px' },
  tab:       { background:'none', border:'none', fontSize:'16px', cursor:'pointer', padding:'8px 16px', borderRadius:'8px', color:'#555' },
  activeTab: { background:'#e8f0fe', color:'#1a73e8', fontWeight:'bold' },
  badge:     { background:'#1a73e8', color:'#fff', borderRadius:'12px', padding:'2px 8px', fontSize:'12px', marginLeft:'8px' },
  cancelBtn: { background:'#fdecea', color:'#c62828', border:'1px solid #c62828', padding:'6px 16px', borderRadius:'6px', cursor:'pointer', marginBottom:'16px' },
};