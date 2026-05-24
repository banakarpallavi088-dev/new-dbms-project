import { useEffect, useState } from 'react';
import API from '../../api/axios';
 
export default function ManageBookings() {
  const [data,    setData]    = useState({ package_bookings:[], hotel_bookings:[] });
  const [tab,     setTab]     = useState('packages');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/bookings').then(({ data }) => { setData(data); setLoading(false); });
  }, []);

  const statusColor = { confirmed:'#2e7d32', pending:'#e65100', cancelled:'#c62828' };

  if (loading) return <p style={{ textAlign:'center', marginTop:'60px' }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <h2>Manage Bookings</h2>
      <div style={styles.tabs}>
        {['packages','hotels'].map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.active : {}) }}
                  onClick={() => setTab(t)}>
            {t === 'packages' ? `📦 Package Bookings (${data.package_bookings.length})` : `🏨 Hotel Bookings (${data.hotel_bookings.length})`}
          </button>
        ))}
      </div>
      <div style={{ overflowX:'auto' }}>
        {tab === 'packages' ? (
          <table style={styles.table}>
            <thead><tr>{['ID','User','Package','Date','Persons','Total','Status','Booked At'].map(h =>
              <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
            <tbody>
              {data.package_bookings.map(b => (
                <tr key={b.booking_id} style={{ borderBottom:'1px solid #eee' }}>
                  <td style={styles.td}>{b.booking_id}</td>
                  <td style={styles.td}>{b.full_name}</td>
                  <td style={styles.td}>{b.title}</td>
                  <td style={styles.td}>{new Date(b.travel_date).toLocaleDateString()}</td>
                  <td style={styles.td}>{b.num_persons}</td>
                  <td style={styles.td}>₹{Number(b.total_price).toLocaleString('en-IN')}</td>
                  <td style={styles.td}><span style={{ color: statusColor[b.status], fontWeight:'bold', textTransform:'capitalize' }}>{b.status}</span></td>
                  <td style={styles.td}>{new Date(b.booked_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={styles.table}>
            <thead><tr>{['ID','User','Hotel','Room','Check-in','Check-out','Total','Status'].map(h =>
              <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
            <tbody>
              {data.hotel_bookings.map(b => (
                <tr key={b.hotel_booking_id} style={{ borderBottom:'1px solid #eee' }}>
                  <td style={styles.td}>{b.hotel_booking_id}</td>
                  <td style={styles.td}>{b.full_name}</td>
                  <td style={styles.td}>{b.hotel_name}</td>
                  <td style={styles.td} style={{ textTransform:'capitalize' }}>{b.room_type}</td>
                  <td style={styles.td}>{new Date(b.check_in).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(b.check_out).toLocaleDateString()}</td>
                  <td style={styles.td}>₹{Number(b.total_price).toLocaleString('en-IN')}</td>
                  <td style={styles.td}><span style={{ color: statusColor[b.status], fontWeight:'bold', textTransform:'capitalize' }}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:  { maxWidth:'1200px', margin:'0 auto', padding:'32px 16px' },
  tabs:  { display:'flex', gap:'12px', marginBottom:'20px' },
  tab:   { background:'none', border:'1px solid #ddd', padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  active:{ background:'#1a73e8', color:'#fff', border:'none', fontWeight:'bold' },
  table: { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  th:    { background:'#1a73e8', color:'#fff', padding:'12px 14px', textAlign:'left', fontSize:'13px' },
  td:    { padding:'10px 14px', fontSize:'13px' },
};
