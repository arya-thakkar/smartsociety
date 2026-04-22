import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';


import Login from './pages/Login';
import Register from './pages/Register';
import ResidentDashboard from './pages/dashboards/ResidentDashboard';
import GuardDashboard from './pages/dashboards/GuardDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import Profile from './pages/Profile';


import MainLayout from './components/layout/MainLayout';

import SocietySetup from './pages/SocietySetup';
import Members from './pages/Members';
import Complaints from './pages/Complaints';
import Announcements from './pages/Announcements';
import Visitors from './pages/Visitors';
import GateLive from './pages/GateLive';
import Meetings from './pages/Meetings';
import Amenities from './pages/Amenities';
import GuestInvite from './pages/GuestInvite';
import SocietyFeed from './pages/SocietyFeed';
import Logs from './pages/Logs';
import Scanner from './pages/Scanner';
import Ledger from './pages/Ledger';
import Finance from './pages/Finance';
import ManageTasks from './pages/ManageTasks';
import StaffDirectory from './pages/StaffDirectory';
import PlaceholderPage from './pages/PlaceholderPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, societyId } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is pending, they must finish setup first
  if (user.role === 'pending' && window.location.pathname !== '/society-setup') {
    return <Navigate to="/society-setup" replace />;
  }

  // If no society, and NOT on setup or profile, go to setup
  if (!societyId && user.role !== 'pending') {
    return <Navigate to="/society-setup" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Prevent redirecting to /dashboard/pending
    const target = user.role === 'pending' || !user.role ? '/society-setup' : `/dashboard/${user.role}`;
    return <Navigate to={target} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  const { user, logout, societyId } = useAuthStore();
  
  useEffect(() => {
    // Logout if role is completely invalid (not even pending)
    const validRoles = ['resident', 'guard', 'admin', 'pending'];
    if (user && !validRoles.includes(user.role)) {
      logout();
    }
  }, [user, logout]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/" replace />} 
          />
          
          {/* Society Setup */}
          <Route 
            path="/society-setup" 
            element={user ? (societyId && user.role !== 'pending' ? <Navigate to="/" replace /> : <SocietySetup />) : <Navigate to="/login" replace />} 
          />

          {/* Dashboards and Features */}
          <Route path="/dashboard/resident" element={<ProtectedRoute allowedRoles={['resident']}><ResidentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/guard" element={<ProtectedRoute allowedRoles={['guard']}><GuardDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="/profile" element={user ? <MainLayout><Profile /></MainLayout> : <Navigate to="/login" replace />} />
          <Route path="/members" element={<ProtectedRoute allowedRoles={['admin', 'resident', 'guard']}><Members /></ProtectedRoute>} />
          
          {/* Resident Features */}
          <Route path="/invite-visitor" element={<ProtectedRoute allowedRoles={['resident']}><GuestInvite /></ProtectedRoute>} />
          <Route path="/ledger" element={<ProtectedRoute allowedRoles={['resident']}><Ledger /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute allowedRoles={['resident', 'admin', 'guard']}><SocietyFeed /></ProtectedRoute>} />
          
          {/* Admin Features */}
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['admin']}><StaffDirectory /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute allowedRoles={['admin']}><Finance /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute allowedRoles={['admin']}><Announcements /></ProtectedRoute>} />

          {/* Shared Features */}
          <Route path="/complaints" element={<ProtectedRoute allowedRoles={['resident', 'admin', 'guard']}><Complaints /></ProtectedRoute>} />
          <Route path="/amenities" element={<ProtectedRoute allowedRoles={['resident', 'admin']}><Amenities /></ProtectedRoute>} />
          <Route path="/meetings" element={<ProtectedRoute allowedRoles={['resident', 'admin']}><Meetings /></ProtectedRoute>} />
          <Route path="/gate" element={<ProtectedRoute allowedRoles={['guard']}><GateLive /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute allowedRoles={['guard']}><Scanner /></ProtectedRoute>} />
          <Route path="/visitors" element={<ProtectedRoute allowedRoles={['guard']}><Visitors /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute allowedRoles={['guard', 'admin']}><Logs /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute allowedRoles={['admin', 'resident', 'guard']}><ManageTasks /></ProtectedRoute>} />
          
          {/* Root Redirects */}
          <Route path="/" element={<Navigate to={user ? (user.role === 'pending' || !societyId ? '/society-setup' : `/dashboard/${user.role}`) : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
