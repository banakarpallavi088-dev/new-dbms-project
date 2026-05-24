import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const [form,    setForm]    = useState({ full_name:'', email:'', password:'', phone:'' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account 🚀</h2>
        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          {[
            { name:'full_name', label:'Full Name',   type:'text',     placeholder:'John Doe' },
            { name:'email',     label:'Email',        type:'email',    placeholder:'you@email.com' },
            { name:'password',  label:'Password',     type:'password', placeholder:'Min 6 characters' },
            { name:'phone',     label:'Phone Number', type:'tel',      placeholder:'9XXXXXXXXX' },
          ].map(f => (
            <div key={f.name}>
              <label style={styles.label}>{f.label}</label>
              <input style={styles.input} type={f.type} name={f.name}
                     placeholder={f.placeholder} onChange={handleChange}
                     required={f.name !== 'phone'} />
            </div>
          ))}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'16px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:    { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', background:'#f5f7fa' },
  card:    { background:'#fff', padding:'40px', borderRadius:'12px', width:'100%', maxWidth:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  heading: { textAlign:'center', marginBottom:'24px', color:'#1a73e8' },
  label:   { display:'block', marginBottom:'4px', fontWeight:'500', fontSize:'14px' },
  input:   { width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'16px', fontSize:'15px', boxSizing:'border-box' },
  btn:     { width:'100%', padding:'12px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', fontWeight:'bold', cursor:'pointer' },
  error:   { background:'#fdecea', color:'#c62828', padding:'10px', borderRadius:'6px', marginBottom:'16px', fontSize:'14px' },
  success: { background:'#e8f5e9', color:'#2e7d32', padding:'10px', borderRadius:'6px', marginBottom:'16px', fontSize:'14px' },
};