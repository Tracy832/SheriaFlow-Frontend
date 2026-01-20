// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts & Pages
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StatCard from './components/common/StatCard';
import Login from './components/pages/Login'; 
import Register from './components/pages/Register';

// Dashboard Parts
import RecentPayrolls from './components/dashboard/RecentPayrolls';
import DepartmentStats from './components/dashboard/DepartmentStats';

// 1. Layout Wrapper (Sidebar + Main Content)
const LayoutWrapper = () => (
  <div className="min-h-screen bg-slate-50 font-sans flex">
    <Sidebar />
    <main className="flex-1 ml-64 transition-all duration-300">
      <Outlet />
    </main>
  </div>
);

// 2. Protected Route Guard (Checks for our Fake Token)
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  return token ? <LayoutWrapper /> : <Navigate to="/login" replace />;
};

// 3. Dashboard Component
const Dashboard = () => (
  <div className="p-8">
    <Header 
      title="Dashboard" 
      subtitle="Monday, 19 January 2026"
      user={{ name: "Roney Baraka", role: "CEO", initials: "RB" }}
    />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Payroll Cost" value="KES 5.2M" icon="💲" iconColorClass="bg-slate-900 text-white" />
      <StatCard title="Active Employees" value="127" icon="👥" iconColorClass="bg-emerald-100 text-emerald-600" />
      <StatCard title="Next Pay Date" value="Dec 28, 2025" icon="💳" iconColorClass="bg-blue-100 text-blue-600" />
      <StatCard title="Compliance" value="98%" icon="✅" iconColorClass="bg-emerald-100 text-emerald-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2"><RecentPayrolls /></div>
      <div className="lg:col-span-1"><DepartmentStats /></div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Dashboard) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<div className="p-8"><h1>Employees Page</h1></div>} />
          <Route path="/payroll" element={<div className="p-8"><h1>Payroll Page</h1></div>} />
          <Route path="/reports" element={<div className="p-8"><h1>Reports Page</h1></div>} />
          <Route path="/settings" element={<div className="p-8"><h1>Settings Page</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;