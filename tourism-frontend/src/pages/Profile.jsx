import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Profile() {
  const [user,    setUser]    = useState(null);
  const [form,    setForm]    = useState({ full_name:'', phone:'' });
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/profile').then(({ data }) => {
      setUser(data);
      setForm({ full_name: data.full_name, phone: data.phone || '' });
      setLoading(false);
    });
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', form);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Update failed.');
    }
  };

  if (loading) return <p style={{ textAlign:'center', marginTop:'80px' }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>My Profile</h2>
        <div style={styles.info}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <span style={{ textTransform:'capitalize' }}>{user.role}</span></p>
          <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        <hr />
        <h3>Update Profile</h3>
        {msg && <p style={{ color: msg.includes('success') ? 'green' : 'red' }}>{msg}</p>}
        <form onSubmit={handleUpdate}>
          <label style={styles.label}>Full Name</label>
          <input style={styles.input} value={form.full_name}
                 onChange={e => setForm({...form, full_name: e.target.value})} required />
          <label style={styles.label}>Phone</label>
          <input style={styles.input} value={form.phone}
                 onChange={e => setForm({...form, phone: e.target.value})} />
          <button style={styles.btn} type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page:    { display:'flex', justifyContent:'center', padding:'40px 16px', background:'#f5f7fa', minHeight:'80vh' },
  card:    { background:'#fff', padding:'36px', borderRadius:'12px', width:'100%', maxWidth:'480px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' },
  heading: { color:'#1a73e8', marginBottom:'20px' },
  info:    { background:'#f5f7fa', borderRadius:'8px', padding:'16px', marginBottom:'20px' },
  label:   { display:'block', marginBottom:'4px', fontWeight:'500', fontSize:'14px' },
  input:   { width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'16px', fontSize:'15px', boxSizing:'border-box' },
  btn:     { background:'#1a73e8', color:'#fff', border:'none', padding:'10px 24px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
};