import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const METHODS = ['upi','credit_card','debit_card','net_banking','wallet'];

export default function Payment() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const [method,  setMethod]  = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  if (!state) return <p style={{ textAlign:'center' }}>No payment data. <a href="/">Go home</a></p>;

  const handlePay = async () => {
    setLoading(true); setError('');
    try {
      await API.post('/payments', {
        package_booking_id: state.type === 'package' ? state.booking_id       : null,
        hotel_booking_id:   state.type === 'hotel'   ? state.hotel_booking_id : null,
        amount: state.amount,
        method,
      });
      navigate('/payment/success', { state: { amount: state.amount, method } });
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>💳 Complete Payment</h2>
        <div style={styles.summary}>
          <p>Booking type: <strong style={{ textTransform:'capitalize' }}>{state.type}</strong></p>
          <p style={{ fontSize:'24px', fontWeight:'bold', color:'#1a73e8', margin:'8px 0' }}>
            ₹{Number(state.amount).toLocaleString('en-IN')}
          </p>
        </div>
        <h3>Select Payment Method</h3>
        <div style={styles.methods}>
          {METHODS.map(m => (
            <button key={m}
                    style={{ ...styles.method, ...(method === m ? styles.selected : {}) }}
                    onClick={() => setMethod(m)}>
              {m.replace(/_/g,' ').toUpperCase()}
            </button>
          ))}
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} onClick={handlePay} disabled={loading}>
          {loading ? 'Processing...' : `Pay ₹${Number(state.amount).toLocaleString('en-IN')}`}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page:     { display:'flex', justifyContent:'center', padding:'60px 16px', background:'#f5f7fa', minHeight:'80vh' },
  card:     { background:'#fff', padding:'40px', borderRadius:'12px', width:'100%', maxWidth:'460px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  heading:  { textAlign:'center', color:'#1a73e8', marginBottom:'24px' },
  summary:  { background:'#f5f7fa', borderRadius:'8px', padding:'16px', marginBottom:'24px', textAlign:'center' },
  methods:  { display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'24px' },
  method:   { padding:'10px 16px', borderRadius:'8px', border:'1px solid #ddd', cursor:'pointer', background:'#fff', fontSize:'13px' },
  selected: { background:'#e8f0fe', borderColor:'#1a73e8', color:'#1a73e8', fontWeight:'bold' },
  btn:      { width:'100%', padding:'14px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:'8px', fontSize:'17px', fontWeight:'bold', cursor:'pointer' },
  error:    { background:'#fdecea', color:'#c62828', padding:'10px', borderRadius:'6px', marginBottom:'16px', fontSize:'14px' },
};