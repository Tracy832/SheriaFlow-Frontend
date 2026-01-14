// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Hook to check which page is active

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/" },
    { name: "Employees", icon: "👥", path: "/employees" },
    { name: "Payroll", icon: "💳", path: "/payroll" },
    { name: "Reports", icon: "📄", path: "/reports" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800">
      
      {/* 1. Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          SF
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">SheriaFlow</h1>
          <p className="text-slate-400 text-xs">Payroll System</p>
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white" // Active styling
                  : "text-slate-400 hover:bg-slate-800 hover:text-white" // Inactive styling
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <Link 
          to="/login" 
          className="flex items-center gap-3 text-slate-400 hover:text-white text-sm font-medium w-full px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span>🚪</span> Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;