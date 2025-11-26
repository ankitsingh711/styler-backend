import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import ToastContainer from './components/common/ToastContainer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Services from './pages/Services';
import Profile from './pages/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import { Users, Stylers, Services as AdminServices, Appointments } from './pages/admin/AdminPages';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

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
      <ToastContainer />
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
            <Layout showFooter={false}>
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Layout showFooter={false}>
              <ProtectedRoute adminOnly>
                <Users />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/stylers"
          element={
            <Layout showFooter={false}>
              <ProtectedRoute adminOnly>
                <Stylers />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/services"
          element={
            <Layout showFooter={false}>
              <ProtectedRoute adminOnly>
                <AdminServices />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <Layout showFooter={false}>
              <ProtectedRoute adminOnly>
                <Appointments />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
