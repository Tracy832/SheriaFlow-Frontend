import { useState } from 'react';
import Header from '../layout/Header';

const Settings = () => {
  // State for toggles
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // State for Tax Configurations
  const [housingLevy, setHousingLevy] = useState(true);
  const [shifEnabled, setShifEnabled] = useState(true);

  return (
    <div className="p-8">
      <Header 
        title="Settings" 
        subtitle="Manage system configurations"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* SECTION 1: Company Profile (UPDATED) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg">Company Profile</h3>
            <p className="text-slate-500 text-sm">Basic information about your organization</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Row 1: Company Name (Full Width) */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <input 
                type="text" 
                defaultValue="Acme Corporation Kenya Ltd" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700" 
              />
            </div>

            {/* Row 2: KRA & NSSF */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Company KRA PIN</label>
              <input 
                type="text" 
                defaultValue="P051234567X" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">NSSF Employer Number</label>
              <input 
                type="text" 
                defaultValue="123456789" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700" 
              />
            </div>

            {/* Row 3: NHIF & Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">NHIF Employer Number (Optional)</label>
              <input 
                type="text" 
                placeholder="If applicable" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Company Email</label>
              <input 
                type="email" 
                defaultValue="payroll@acmecorp.co.ke" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700" 
              />
            </div>

            {/* Row 4: Physical Address (Full Width) */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Physical Address</label>
              <input 
                type="text" 
                defaultValue="ABC Plaza, Waiyaki Way, Westlands, Nairobi" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700" 
              />
            </div>

          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* SECTION 2: Tax & Compliance Configuration */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
              🛡️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Tax & Compliance Configuration</h3>
              <p className="text-slate-500 text-sm">Manage statutory deductions and compliance settings</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            
            {/* Card 1: Housing Levy */}
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-emerald-200 transition-colors bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">Housing Levy</span>
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

            {/* Card 2: SHIF */}
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-emerald-200 transition-colors bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">SHIF (Social Health Insurance)</span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">2.75%</span>
                </div>
                <p className="text-sm text-slate-500">SHA compliance - replaces NHIF deduction</p>
              </div>
              <button 
                onClick={() => setShifEnabled(!shifEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${shifEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${shifEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Card 3: PAYE */}
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">PAYE (Income Tax)</span>
                  <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">Progressive</span>
                </div>
                <p className="text-sm text-slate-500">KRA tax deduction - always active per statutory requirements</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs px-3 py-1 rounded-full font-medium">
                Always On
              </span>
            </div>

            {/* Card 4: NSSF */}
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">NSSF Contributions</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">6% Tier I & II</span>
                </div>
                <p className="text-sm text-slate-500">Social security contributions - mandatory for all employees</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs px-3 py-1 rounded-full font-medium">
                Always On
              </span>
            </div>

          </div>
        </div>

        {/* SECTION 3: System Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg">System Preferences</h3>
            <p className="text-slate-500 text-sm">Customize your dashboard experience</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive monthly payroll summaries via email</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Dark Mode</p>
                <p className="text-xs text-slate-500">Switch to a darker theme for low light</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-red-600 text-lg">Security</h3>
            <p className="text-slate-500 text-sm">Manage your account access</p>
          </div>
          <div className="p-6 flex items-center justify-between">
             <div>
                <p className="font-medium text-slate-800">Change Password</p>
                <p className="text-xs text-slate-500">Last changed: 3 months ago</p>
             </div>
             <button className="border border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Update Password
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;