import { useState } from 'react';
import Header from '../layout/Header';
import { 
  Building2, Shield, Bell, Moon, Lock, 
  Save, AlertTriangle // <--- Removed 'Check' from here
} from 'lucide-react';

const Settings = () => {
  // State for toggles
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // State for Tax Configurations
  const [housingLevy, setHousingLevy] = useState(true);
  const [shifEnabled, setShifEnabled] = useState(true);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <Header 
        title="Settings" 
        subtitle="Manage system configurations and compliance"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      <div className="max-w-5xl space-y-8">
        
        {/* SECTION 1: Company Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Company Profile</h3>
              <p className="text-slate-500 text-sm">Basic information about your organization</p>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company Name</label>
              <input type="text" defaultValue="Acme Corporation Kenya Ltd" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company KRA PIN</label>
              <input type="text" defaultValue="P051234567X" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">NSSF Employer Number</label>
              <input type="text" defaultValue="123456789" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company Email</label>
              <input type="email" defaultValue="payroll@acmecorp.co.ke" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Physical Address</label>
              <input type="text" defaultValue="ABC Plaza, Waiyaki Way, Westlands" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" />
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 ml-auto">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>

        {/* SECTION 2: Tax & Compliance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Tax & Compliance</h3>
              <p className="text-slate-500 text-sm">Manage statutory deductions and compliance settings</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            
            {/* Housing Levy */}
            <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${housingLevy ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">Housing Levy</span>
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">1.5%</span>
                </div>
                <p className="text-sm text-slate-500">Affordable Housing Levy deduction from gross pay</p>
              </div>
              <button 
                onClick={() => setHousingLevy(!housingLevy)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${housingLevy ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${housingLevy ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* SHIF */}
            <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${shifEnabled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">SHIF (Social Health)</span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">2.75%</span>
                </div>
                <p className="text-sm text-slate-500">Social Health Authority (SHA) compliance</p>
              </div>
              <button 
                onClick={() => setShifEnabled(!shifEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${shifEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${shifEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* NSSF (Locked) */}
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50 opacity-75">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-700">NSSF Contributions</span>
                  <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">Tiered</span>
                </div>
                <p className="text-sm text-slate-500">Mandatory statutory deduction (Locked)</p>
              </div>
              <Lock size={18} className="text-slate-400" />
            </div>

          </div>
        </div>

        {/* SECTION 3: System Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bell size={20} /></div>
               <h3 className="font-bold text-slate-900">Notifications</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Email Reports</p>
                <p className="text-xs text-slate-500">Send monthly P10 summaries</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Moon size={20} /></div>
               <h3 className="font-bold text-slate-900">Appearance</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Dark Mode</p>
                <p className="text-xs text-slate-500">Reduce eye strain</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Security */}
        <div className="bg-red-50 rounded-xl border border-red-100 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full text-red-500 shadow-sm">
                 <AlertTriangle size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-red-900">Danger Zone</h3>
                 <p className="text-red-700/80 text-sm">Reset all payroll data or delete organization account</p>
              </div>
           </div>
           <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm">
              Manage Access
           </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;