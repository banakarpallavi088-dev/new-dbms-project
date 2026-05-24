import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🌍 TourismMS</Link>
      <div style={styles.links}>
        <Link to="/packages" style={styles.link}>Packages</Link>
        <Link to="/hotels"   style={styles.link}>Hotels</Link>
        {user ? (
          <>
            <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
            <Link to="/profile"     style={styles.link}>Profile</Link>
            {isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', background:'#1a73e8', color:'#fff' },
  brand: { color:'#fff', textDecoration:'none', fontWeight:'bold', fontSize:'20px' },
  links: { display:'flex', gap:'16px', alignItems:'center' },
  link:  { color:'#fff', textDecoration:'none', fontSize:'15px' },
  btn:   { background:'transparent', border:'1px solid #fff', color:'#fff', padding:'6px 14px', borderRadius:'6px', cursor:'pointer' },
};