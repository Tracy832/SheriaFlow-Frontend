import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import { DollarSign, Users, Calendar, ShieldCheck } from 'lucide-react';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StatCard from './components/common/StatCard';
import Login from './components/pages/Login'; 
import Register from './components/pages/Register';
import Employees from './components/pages/Employees'; 
import Payroll from './components/pages/Payroll'; 
import Reports from './components/pages/Reports'; 
import Settings from './components/pages/Settings'; // <--- 1. IMPORT SETTINGS HERE

// Dashboard Widgets
import PayrollChart from './components/dashboard/PayrollChart';
import RecentActivity from './components/dashboard/RecentActivity';
import DepartmentStats from './components/dashboard/DepartmentStats';

// 1. Layout Wrapper with Sidebar State
const LayoutWrapper = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      
      <main className={clsx(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <Outlet />
      </main>
    </div>
  );
};

// 2. Auth Guard
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  return token ? <LayoutWrapper /> : <Navigate to="/login" replace />;
};

// 3. Dashboard Component
const Dashboard = () => (
  <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
    <Header 
      title="Dashboard" 
      subtitle="Tuesday, 20 January 2026"
      user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Payroll Cost" value="KES 5.2M" icon={DollarSign} trend="+12%" trendUp={true} />
      <StatCard title="Active Employees" value="127" icon={Users} trend="+4" trendUp={true} />
      <StatCard title="Next Pay Date" value="Jan 28, 2026" icon={Calendar} />
      <StatCard title="Compliance Status" value="Compliant" icon={ShieldCheck} trend="Updated" trendUp={true} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-full">
        <PayrollChart />
      </div>
      <div className="lg:col-span-1 h-full">
        <RecentActivity />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div className="lg:col-span-1">
          <DepartmentStats />
       </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} /> 
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* --- FIX IS HERE: Use the Settings Component --- */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;