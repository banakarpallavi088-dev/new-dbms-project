import { useNavigate } from 'react-router-dom';

export default function PackageCard({ pkg }) {
  const navigate = useNavigate();
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{pkg.title}</h3>
      <p style={styles.dest}>📍 {pkg.destination}</p>
      <p>⏱ {pkg.duration_days} days &nbsp;|&nbsp; 💺 {pkg.available_seats} seats left</p>
      <p style={styles.price}>₹{Number(pkg.price).toLocaleString('en-IN')} / person</p>
      <button style={styles.btn} onClick={() => navigate(`/packages/${pkg.package_id}`)}>
        View Details
      </button>
    </div>
  );
}

const styles = {
  card:  { border:'1px solid #ddd', borderRadius:'10px', padding:'20px', background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,0.08)' },
  title: { margin:'0 0 8px', color:'#1a73e8' },
  dest:  { color:'#555', margin:'4px 0' },
  price: { fontWeight:'bold', color:'#e65100', fontSize:'18px', margin:'10px 0' },
  btn:   { background:'#1a73e8', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontSize:'14px' },
};