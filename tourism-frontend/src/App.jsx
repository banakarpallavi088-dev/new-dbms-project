import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import Navbar              from './components/Navbar';
import Footer              from './components/Footer';
import PrivateRoute        from './components/PrivateRoute';

import Home                from './pages/Home';
import Login               from './pages/Login';
import Register            from './pages/Register';
import Packages            from './pages/Packages';
import PackageDetail       from './pages/PackageDetail';
import Hotels              from './pages/Hotels';
import HotelDetail         from './pages/HotelDetail';
import Profile             from './pages/Profile';
import MyBookings          from './pages/MyBookings';
import Payment             from './pages/Payment';
import PaymentSuccess      from './pages/PaymentSuccess';

import AdminDashboard      from './pages/admin/AdminDashboard';
import ManageUsers         from './pages/admin/ManageUsers';
import ManagePackages      from './pages/admin/ManagePackages';
import ManageHotels        from './pages/admin/ManageHotels';
import ManageBookings      from './pages/admin/ManageBookings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/packages"      element={<Packages />} />
          <Route path="/packages/:id"  element={<PackageDetail />} />
          <Route path="/hotels"        element={<Hotels />} />
          <Route path="/hotels/:id"    element={<HotelDetail />} />

          {/* Protected — logged-in users */}
          <Route path="/profile"          element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/my-bookings"      element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/payment"          element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/payment/success"  element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/admin"                element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users"          element={<PrivateRoute adminOnly><ManageUsers /></PrivateRoute>} />
          <Route path="/admin/packages"       element={<PrivateRoute adminOnly><ManagePackages /></PrivateRoute>} />
          <Route path="/admin/hotels"         element={<PrivateRoute adminOnly><ManageHotels /></PrivateRoute>} />
          <Route path="/admin/bookings"       element={<PrivateRoute adminOnly><ManageBookings /></PrivateRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
