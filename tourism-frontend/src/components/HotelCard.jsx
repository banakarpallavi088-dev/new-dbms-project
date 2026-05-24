import { useNavigate } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  return (
    <div style={styles.card}>
      <h3 style={styles.name}>{hotel.name}</h3>
      <p>📍 {hotel.city}</p>
      <p>⭐ {hotel.rating} / 5</p>
      <p style={{ color:'#555', fontSize:'13px' }}>{hotel.address}</p>
      <button style={styles.btn} onClick={() => navigate(`/hotels/${hotel.hotel_id}`)}>
        View Rooms
      </button>
    </div>
  );
}

const styles = {
  card: { border:'1px solid #ddd', borderRadius:'10px', padding:'20px', background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,0.08)' },
  name: { margin:'0 0 8px', color:'#1a73e8' },
  btn:  { background:'#1a73e8', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', marginTop:'10px' },
};