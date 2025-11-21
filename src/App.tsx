import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/protectedRoute.tsx';
import Auth from './pages/auth.tsx' 
import Dashboard from './pages/dashboard.tsx';
import Destination from './pages/destination.tsx';
import Order from './pages/order.tsx';
import Akomodasi from './pages/akomodasi.tsx'
import User from './pages/user.tsx';
import Laporan from './pages/laporan.tsx';
import Profile from './pages/profile.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/destination" element={<ProtectedRoute><Destination /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/akomodasi" element={<ProtectedRoute><Akomodasi /></ProtectedRoute>} />
        <Route path='/user' element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path='/laporan' element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
