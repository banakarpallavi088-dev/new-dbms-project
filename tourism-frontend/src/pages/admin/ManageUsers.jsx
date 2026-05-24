import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/users').then(({ data }) => { setUsers(data); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ textAlign:'center', marginTop:'60px' }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h2>Manage Users</h2>
        <input style={styles.search} placeholder="Search users..."
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>{['#','Name','Email','Phone','Role','Joined'].map(h =>
              <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.user_id} style={{ borderBottom:'1px solid #eee' }}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{u.full_name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.phone || '—'}</td>
                <td style={styles.td}>
                  <span style={{ background: u.role === 'admin' ? '#fce4ec' : '#e8f5e9',
                                 color: u.role === 'admin' ? '#c62828' : '#2e7d32',
                                 padding:'2px 10px', borderRadius:'12px', fontSize:'12px' }}>
                    {u.role}
                  </span>
                </td>
                <td style={styles.td}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page:   { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  search: { padding:'8px 14px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', width:'240px' },
  table:  { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  th:     { background:'#1a73e8', color:'#fff', padding:'12px 14px', textAlign:'left', fontSize:'13px' },
  td:     { padding:'10px 14px', fontSize:'13px' },
};

