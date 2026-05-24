import { useEffect, useState } from 'react';
import API from '../api/axios';
import PackageCard from '../components/PackageCard';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/packages').then(({ data }) => { setPackages(data); setLoading(false); });
  }, []);

  const filtered = packages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Tour Packages</h2>
        <input style={styles.search} placeholder="Search by name or destination..."
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <p>Loading packages...</p> : (
        filtered.length === 0
          ? <p>No packages found.</p>
          : <div style={styles.grid}>
              {filtered.map(pkg => <PackageCard key={pkg.package_id} pkg={pkg} />)}
            </div>
      )}
    </div>
  );
}

const styles = {
  page:   { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' },
  search: { padding:'10px 16px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'15px', width:'300px' },
  grid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'24px' },
};