import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Header from './components/Layout/Header';
import Dashboard from './components/Guest/Dashboard';
import Profile from './components/Guest/Profile';
import HostDashboard from './components/Host/HostDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    if (!user) return 'auth';
    if (user.role === 'admin') return 'admin-dashboard';
    return user.role === 'guest' ? 'dashboard' : 'host-dashboard';
  });

  // Update page when user changes or logs in
  React.useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage('auth');
    } else if (user) {
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage(user.role === 'guest' ? 'dashboard' : 'host-dashboard');
      }
    }
  }, [isAuthenticated, user]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'host-dashboard':
        return <HostDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        if (user?.role === 'admin') return <AdminDashboard />;
        return user?.role === 'guest' ? <Dashboard /> : <HostDashboard />;
    }
  };

  // Admin users get a different layout
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>{renderPage()}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main>{renderPage()}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;