import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RBACProvider } from './context/RBACContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Services from './pages/Services';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import { Users, Stylers, Services as AdminServices, Appointments } from './pages/admin/AdminPages';


// Layout Component
const Layout = ({ children, showFooter = true, showNavbar = true }) => {
  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<Layout showFooter={false}><Login /></Layout>} />
        <Route path="/register" element={<Layout showFooter={false}><Login isRegisterMode={true} /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Layout showFooter={false} showNavbar={false}><AdminLogin /></Layout>} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="superadmin" redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stylers"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Stylers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <AdminServices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role={["superadmin", "salon_owner", "receptionist"]} redirectTo="/admin/login">
              <Layout showFooter={false}>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Access */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <RBACProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </RBACProvider>
    </AuthProvider>
  );
}

export default App;
