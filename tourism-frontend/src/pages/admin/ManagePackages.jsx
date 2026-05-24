import { useEffect, useState } from 'react';
import API from '../../api/axios';

const EMPTY = { title:'', description:'', price:'', duration_days:'', destination:'', available_seats:'' };

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [form,     setForm]     = useState(EMPTY);
  const [editing,  setEditing]  = useState(null);
  const [msg,      setMsg]      = useState('');

  const load = () => API.get('/packages').then(({ data }) => setPackages(data));
  useEffect(() => { load(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/packages/${editing}`, form);
        setMsg('Package updated.');
      } else {
        await API.post('/packages', form);
        setMsg('Package created.');
      }
      setForm(EMPTY); setEditing(null); load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error.');
    }
  };

  const handleEdit   = pkg => { setForm(pkg); setEditing(pkg.package_id); };
  const handleDelete = async id => {
    if (!window.confirm('Delete this package?')) return;
    await API.delete(`/packages/${id}`); load();
  };

  return (
    <div style={styles.page}>
      <h2>Manage Packages</h2>
      <div style={styles.layout}>
        {/* Form */}
        <div style={styles.formBox}>
          <h3>{editing ? 'Edit Package' : 'Add Package'}</h3>
          {msg && <p style={{ color:'green' }}>{msg}</p>}
          <form onSubmit={handleSubmit}>
            {[
              { name:'title',           label:'Title',            type:'text' },
              { name:'destination',     label:'Destination',      type:'text' },
              { name:'price',           label:'Price (₹)',        type:'number' },
              { name:'duration_days',   label:'Duration (days)',  type:'number' },
              { name:'available_seats', label:'Available Seats',  type:'number' },
            ].map(f => (
              <div key={f.name}>
                <label style={styles.label}>{f.label}</label>
                <input style={styles.input} type={f.type} name={f.name}
                       value={form[f.name]} onChange={handleChange} required />
              </div>
            ))}
            <label style={styles.label}>Description</label>
            <textarea style={{ ...styles.input, height:'80px', resize:'vertical' }}
                      name="description" value={form.description} onChange={handleChange} />
            <button style={styles.btn} type="submit">{editing ? 'Update' : 'Create'}</button>
            {editing && (
              <button type="button" style={styles.cancelBtn}
                      onClick={() => { setForm(EMPTY); setEditing(null); }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div style={{ flex:1, overflowX:'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>{['Title','Destination','Price','Days','Seats','Status','Actions'].map(h =>
                <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {packages.map(p => (
                <tr key={p.package_id} style={{ borderBottom:'1px solid #eee' }}>
                  <td style={styles.td}>{p.title}</td>
                  <td style={styles.td}>{p.destination}</td>
                  <td style={styles.td}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td style={styles.td}>{p.duration_days}</td>
                  <td style={styles.td}>{p.available_seats}</td>
                  <td style={styles.td}>
                    <span style={{ color: p.status === 'active' ? 'green' : 'gray' }}>{p.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn}   onClick={() => handleEdit(p)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p.package_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:      { maxWidth:'1200px', margin:'0 auto', padding:'32px 16px' },
  layout:    { display:'flex', gap:'32px', flexWrap:'wrap' },
  formBox:   { minWidth:'280px', maxWidth:'320px', background:'#fff', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  label:     { display:'block', marginBottom:'4px', fontSize:'13px', fontWeight:'500' },
  input:     { width:'100%', padding:'8px 12px', borderRadius:'6px', border:'1px solid #ddd', marginBottom:'12px', fontSize:'14px', boxSizing:'border-box' },
  btn:       { width:'100%', padding:'10px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', marginBottom:'8px' },
  cancelBtn: { width:'100%', padding:'8px', background:'#eee', border:'none', borderRadius:'8px', cursor:'pointer' },
  table:     { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  th:        { background:'#1a73e8', color:'#fff', padding:'12px 14px', textAlign:'left', fontSize:'13px' },
  td:        { padding:'10px 14px', fontSize:'13px' },
  editBtn:   { background:'#e8f0fe', color:'#1a73e8', border:'none', padding:'4px 10px', borderRadius:'4px', cursor:'pointer', marginRight:'6px', fontSize:'12px' },
  deleteBtn: { background:'#fdecea', color:'#c62828', border:'none', padding:'4px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'12px' },
};