import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h2 style={styles.heading}>Payment Successful!</h2>
        {state && (
          <div style={styles.details}>
            <p>Amount paid: <strong>₹{Number(state.amount).toLocaleString('en-IN')}</strong></p>
            <p>Method: <strong style={{ textTransform:'capitalize' }}>{state.method?.replace(/_/g,' ')}</strong></p>
          </div>
        )}
        <p style={{ color:'#555' }}>Your booking is confirmed. You can view it in My Bookings.</p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginTop:'24px' }}>
          <button style={styles.btn}        onClick={() => navigate('/my-bookings')}>View My Bookings</button>
          <button style={styles.btnOutline} onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', background:'#f5f7fa' },
  card:       { background:'#fff', padding:'48px', borderRadius:'12px', textAlign:'center', maxWidth:'440px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  icon:       { fontSize:'64px', marginBottom:'16px' },
  heading:    { color:'#2e7d32', marginBottom:'16px' },
  details:    { background:'#e8f5e9', borderRadius:'8px', padding:'16px', marginBottom:'16px' },
  btn:        { background:'#1a73e8', color:'#fff', border:'none', padding:'10px 22px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
  btnOutline: { background:'transparent', color:'#1a73e8', border:'2px solid #1a73e8', padding:'10px 22px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
};