import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/dashboard').then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ textAlign:'center', marginTop:'60px' }}>Loading...</p>;

  const cards = [
    { label:'Total Users',      value: stats.total_users,    icon:'👥', link:'/admin/users' },
    { label:'Tour Packages',    value: stats.total_packages, icon:'📦', link:'/admin/packages' },
    { label:'Hotels',           value: stats.total_hotels,   icon:'🏨', link:'/admin/hotels' },
    { label:'Package Bookings', value: stats.pkg_bookings,   icon:'🗓', link:'/admin/bookings' },
    { label:'Hotel Bookings',   value: stats.hotel_bookings, icon:'🛏', link:'/admin/bookings' },
    { label:'Total Revenue',    value: `₹${Number(stats.total_revenue).toLocaleString('en-IN')}`, icon:'💰', link: null },
  ];

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <div style={styles.grid}>
        {cards.map(c => (
          <div key={c.label}
               style={{ ...styles.card, cursor: c.link ? 'pointer' : 'default' }}
               onClick={() => c.link && navigate(c.link)}>
            <div style={styles.icon}>{c.icon}</div>
            <div style={styles.value}>{c.value}</div>
            <div style={styles.label}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page:    { maxWidth:'1000px', margin:'0 auto', padding:'32px 16px' },
  heading: { color:'#1a73e8', marginBottom:'28px' },
  grid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'20px' },
  card:    { background:'#fff', borderRadius:'12px', padding:'24px', textAlign:'center',
             boxShadow:'0 2px 10px rgba(0,0,0,0.08)', transition:'transform .2s' },
  icon:    { fontSize:'36px', marginBottom:'12px' },
  value:   { fontSize:'28px', fontWeight:'bold', color:'#1a73e8', marginBottom:'6px' },
  label:   { color:'#666', fontSize:'14px' },
};

