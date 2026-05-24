import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back 👋</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" name="email"
                 placeholder="you@email.com" onChange={handleChange} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" name="password"
                 placeholder="••••••••" onChange={handleChange} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'16px' }}>
          Don't have an account? <Link to="/register">Register</Link>
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
};