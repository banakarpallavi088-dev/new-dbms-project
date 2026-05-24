import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Explore the World with Us 🌏</h1>
        <p style={styles.heroSub}>Discover handpicked tour packages and hotels across India</p>
        <div style={{ display:'flex', gap:'16px', justifyContent:'center' }}>
          <button style={styles.btnPrimary} onClick={() => navigate('/packages')}>Browse Packages</button>
          <button style={styles.btnOutline} onClick={() => navigate('/hotels')}>Browse Hotels</button>
        </div>
      </div>
      <div style={styles.features}>
        {[
          { icon:'🏖', title:'Top Destinations', desc:"Handpicked packages to India's most beautiful places" },
          { icon:'🏨', title:'Quality Hotels',   desc:'Verified hotels with transparent pricing and ratings' },
          { icon:'💳', title:'Easy Payments',    desc:'UPI, cards, net banking — pay your way' },
          { icon:'📋', title:'Manage Bookings',  desc:'Track, view and cancel bookings anytime' },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <div style={{ fontSize:'36px' }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p style={{ color:'#666' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero:        { background:'linear-gradient(135deg,#1a73e8,#0d47a1)', color:'#fff', padding:'80px 24px', textAlign:'center' },
  heroTitle:   { fontSize:'42px', margin:'0 0 12px' },
  heroSub:     { fontSize:'18px', margin:'0 0 32px', opacity:0.9 },
  btnPrimary:  { background:'#fff', color:'#1a73e8', border:'none', padding:'12px 28px', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'16px' },
  btnOutline:  { background:'transparent', color:'#fff', border:'2px solid #fff', padding:'12px 28px', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'16px' },
  features:    { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'24px', padding:'48px 32px', maxWidth:'1100px', margin:'0 auto' },
  featureCard: { background:'#fff', border:'1px solid #eee', borderRadius:'12px', padding:'24px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
};