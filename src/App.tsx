// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StatCard from './components/common/StatCard';

// Dashboard Components
import RecentPayrolls from './components/dashboard/RecentPayrolls';
import DepartmentStats from './components/dashboard/DepartmentStats';

// Page Components
import Employees from './components/pages/Employees'; 
import Payroll from './components/pages/Payroll';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';
import Register from './components/pages/Register';

// 1. Layout Wrapper: Decides if Sidebar should be shown
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // We hide the sidebar on Login AND Register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>; // Render full screen page
  }

  // Otherwise render the Dashboard layout
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
};

// 2. The Main Dashboard View
const Dashboard = () => (
  <div className="p-8">
    <Header 
      title="Dashboard" 
      subtitle="Thursday, 8 January 2026"
      user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
    />
    
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Payroll Cost" value="KES 5.2M" icon="💲" iconColorClass="bg-slate-900 text-white" />
      <StatCard title="Active Employees" value="127" icon="👥" iconColorClass="bg-emerald-100 text-emerald-600" />
      <StatCard title="Next Pay Date" value="Dec 28, 2025" icon="💳" iconColorClass="bg-blue-100 text-blue-600" />
      <StatCard title="Compliance Status" value="Compliant" icon="✅" iconColorClass="bg-emerald-100 text-emerald-600" subBadge="• Compliant" />
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
      <LayoutWrapper>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;