import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

// Layout & Common
import Sidebar from './components/layout/Sidebar';
import AIAssistant from './components/common/AIAssistant';

// Pages
import Login from './components/pages/Login'; 
import Register from './components/pages/Register';
import Dashboard from './components/dashboard/Dashboard';
import Employees from './components/pages/Employees'; 
import Payroll from './components/pages/Payroll';  
import Reports from './components/pages/Reports';   
import Settings from './components/pages/Settings';

// 1. Layout Wrapper
const LayoutWrapper = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex relative overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      
      <main className={clsx(
        "flex-1 transition-all duration-300 h-screen overflow-y-auto",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <Outlet />
      </main>

      <AIAssistant />
    </div>
  );
};

// 2. Auth Guard
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  return token ? <LayoutWrapper /> : <Navigate to="/login" replace />;
};

// 3. Main Router
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} /> 
          <Route path="/payroll" element={<Payroll />} />     {/* <--- Active */}
          <Route path="/reports" element={<Reports />} />     {/* <--- Active */}
          <Route path="/settings" element={<Settings />} />   {/* <--- Active */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;