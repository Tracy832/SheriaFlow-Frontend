// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wallet, FileText, Settings, 
  LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Payroll', path: '/payroll', icon: Wallet },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div 
      className={clsx(
        "bg-[#0f172a] text-slate-300 flex flex-col transition-all duration-300 h-screen fixed left-0 top-0 border-r border-slate-800 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
          SF
        </div>
        {!isCollapsed && (
          <div className="ml-3 fade-in">
            <h1 className="text-white font-bold text-lg tracking-tight">SheriaFlow</h1>
            <p className="text-xs text-slate-500">Payroll System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">{item.name}</span>}
            
            {/* Active Indicator */}
            <NavLink to={item.path} className={({ isActive }) => clsx(
               isActive && !isCollapsed ? "absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full" : "hidden"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>

        <button 
          onClick={toggleCollapse}
          className="flex items-center justify-center w-full py-2 text-slate-500 hover:text-white transition-colors bg-slate-800/50 rounded-lg"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center text-xs gap-2"><ChevronLeft size={16} /> <span>Collapse</span></div>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;