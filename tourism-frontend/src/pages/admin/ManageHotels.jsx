import { useEffect, useState } from 'react';
import API from '../../api/axios';

const EMPTY = { name:'', address:'', city:'', rating:'', contact_email:'' };

export default function ManageHotels() {
  const [hotels,  setHotels]  = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [msg,     setMsg]     = useState('');

  const load = () => API.get('/hotels').then(({ data }) => setHotels(data));
  useEffect(() => { load(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/hotels/${editing}`, form); setMsg('Hotel updated.'); }
      else         { await API.post('/hotels', form);           setMsg('Hotel created.'); }
      setForm(EMPTY); setEditing(null); load();
    } catch (err) { setMsg(err.response?.data?.message || 'Error.'); }
  };

  const handleEdit   = h => { setForm(h); setEditing(h.hotel_id); };
  const handleDelete = async id => {
    if (!window.confirm('Delete hotel and all its rooms?')) return;
    await API.delete(`/hotels/${id}`); load();
  };

  return (
    <div style={styles.page}>
      <h2>Manage Hotels</h2>
      <div style={styles.layout}>
        <div style={styles.formBox}>
          <h3>{editing ? 'Edit Hotel' : 'Add Hotel'}</h3>
          {msg && <p style={{ color:'green' }}>{msg}</p>}
          <form onSubmit={handleSubmit}>
            {[
              { name:'name',          label:'Hotel Name',    type:'text' },
              { name:'city',          label:'City',          type:'text' },
              { name:'address',       label:'Address',       type:'text' },
              { name:'rating',        label:'Rating (1-5)',  type:'number' },
              { name:'contact_email', label:'Contact Email', type:'email' },
            ].map(f => (
              <div key={f.name}>
                <label style={styles.label}>{f.label}</label>
                <input style={styles.input} type={f.type} name={f.name}
                       value={form[f.name]} onChange={handleChange}
                       required={!['rating','contact_email'].includes(f.name)}
                       min={f.name==='rating'?1:undefined} max={f.name==='rating'?5:undefined} step={f.name==='rating'?0.1:undefined} />
              </div>
            ))}
            <button style={styles.btn} type="submit">{editing ? 'Update' : 'Create'}</button>
            {editing && (
              <button type="button" style={styles.cancelBtn}
                      onClick={() => { setForm(EMPTY); setEditing(null); }}>Cancel</button>
            )}
          </form>
        </div>
        <div style={{ flex:1, overflowX:'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>{['Name','City','Rating','Email','Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {hotels.map(h => (
                <tr key={h.hotel_id} style={{ borderBottom:'1px solid #eee' }}>
                  <td style={styles.td}>{h.name}</td>
                  <td style={styles.td}>{h.city}</td>
                  <td style={styles.td}>⭐ {h.rating}</td>
                  <td style={styles.td}>{h.contact_email || '—'}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn}   onClick={() => handleEdit(h)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(h.hotel_id)}>Delete</button>
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
  page:      { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  layout:    { display:'flex', gap:'32px', flexWrap:'wrap' },
  formBox:   { minWidth:'280px', maxWidth:'300px', background:'#fff', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
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
