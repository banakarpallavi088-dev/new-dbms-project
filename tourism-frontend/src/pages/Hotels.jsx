import { useEffect, useState } from 'react';
import API from '../api/axios';
import HotelCard from '../components/HotelCard';

export default function Hotels() {
  const [hotels,  setHotels]  = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/hotels').then(({ data }) => { setHotels(data); setLoading(false); });
  }, []);

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Hotels</h2>
        <input style={styles.search} placeholder="Search by name or city..."
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <p>Loading hotels...</p> : (
        filtered.length === 0
          ? <p>No hotels found.</p>
          : <div style={styles.grid}>
              {filtered.map(h => <HotelCard key={h.hotel_id} hotel={h} />)}
            </div>
      )}
    </div>
  );
}

const styles = {
  page:   { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' },
  search: { padding:'10px 16px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'15px', width:'300px' },
  grid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'24px' },
};