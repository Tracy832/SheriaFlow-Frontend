import { Bell, LogOut } from 'lucide-react'; // <--- Removed unused 'User' import
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle: string;
  user?: { 
    name: string;
    role: string;
    initials: string;
  };
}

const Header = ({ title, subtitle, user }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear Auth Token
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // 2. Redirect to Login
    navigate('/login');
  };

  // Fallback defaults if user prop is missing
  const safeUser = user || { name: "User", role: "Staff", initials: "U" };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      
      {/* Left: Page Title & Date */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-xl border border-slate-100 shadow-sm">
        
        {/* Notification Bell */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative group">
          <Bell size={20} />
          {/* Red dot for unread notifications */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white group-hover:animate-ping"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{safeUser.name}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">{safeUser.role}</p>
          </div>
          
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-slate-100">
            {safeUser.initials}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          title="Logout"
          className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;