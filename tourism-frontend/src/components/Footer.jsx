export default function Footer() {
  return (
    <footer style={{ textAlign:'center', padding:'20px', background:'#f1f1f1', marginTop:'40px', color:'#555' }}>
      <p>© {new Date().getFullYear()} Tourism Management System. All rights reserved.</p>
    </footer>
  );
}