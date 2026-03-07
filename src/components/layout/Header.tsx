import { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 

interface HeaderProps {
  title: string;
  subtitle?: string; // Made optional to prevent errors if not passed
  user?: {
    name: string;
    role: string;
    initials: string;
  }; 
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: 'Loading...',
    role: '...',
    initials: '',
    companyName: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me/');
        const data = response.data;
        
        const firstName = data.first_name || '';
        const lastName = data.last_name || '';
        
        setProfile({
          name: `${firstName} ${lastName}`.trim() || data.email || 'Admin',
          role: data.role || 'ADMIN',
          initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AD',
          companyName: data.company_name || ''
        });
      } catch (error) {
        console.error('Failed to fetch user data for header:', error);
        setProfile({
          name: 'System Admin',
          role: 'ADMIN',
          initials: 'SA',
          companyName: 'Offline Mode'
        });
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      
      {/* Left: Page Title, Company Badge & Date */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-200">{title}</h1>
          
          {/* --- DYNAMIC COMPANY BADGE --- */}
          {profile.companyName && (
            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider rounded-md border border-emerald-200 dark:border-emerald-500/30 shadow-sm transition-colors duration-200">
              {profile.companyName}
            </span>
          )}
        </div>
        {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-200">{subtitle}</p>}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 pl-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
        
        {/* Notification Bell */}
        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors relative group">
          <Bell size={20} />
          {/* Red dot for unread notifications */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800 group-hover:animate-ping transition-colors duration-200"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 transition-colors duration-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none transition-colors duration-200">{profile.name}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">{profile.role}</p>
          </div>
          
          <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-slate-100 dark:ring-slate-800 transition-colors duration-200">
            {profile.initials}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          title="Logout"
          className="ml-2 p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;