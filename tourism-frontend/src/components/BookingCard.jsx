export default function BookingCard({ booking, type }) {
  const statusColor = { confirmed:'green', pending:'orange', cancelled:'red' };
  return (
    <div style={styles.card}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h4 style={{ margin:0 }}>
          {type === 'package' ? `📦 ${booking.title}` : `🏨 ${booking.hotel_name}`}
        </h4>
        <span style={{ color: statusColor[booking.status] || '#333', fontWeight:'bold', textTransform:'capitalize' }}>
          {booking.status}
        </span>
      </div>
      {type === 'package' ? (
        <>
          <p>📍 {booking.destination}</p>
          <p>🗓 Travel date: {new Date(booking.travel_date).toLocaleDateString()}</p>
          <p>👥 Persons: {booking.num_persons}</p>
        </>
      ) : (
        <>
          <p>🛏 Room: {booking.room_type}</p>
          <p>📅 Check-in: {new Date(booking.check_in).toLocaleDateString()}</p>
          <p>📅 Check-out: {new Date(booking.check_out).toLocaleDateString()}</p>
        </>
      )}
      <p style={{ fontWeight:'bold' }}>💰 ₹{Number(booking.total_price).toLocaleString('en-IN')}</p>
    </div>
  );
}

const styles = {
  card: { border:'1px solid #ddd', borderRadius:'10px', padding:'18px', background:'#fff', marginBottom:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' },
};