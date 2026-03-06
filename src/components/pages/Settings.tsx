import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import api from '../../api/axios';
import { isAxiosError } from 'axios';
import { 
  Building2, Shield, Bell, Moon, Lock, 
  Save, AlertTriangle, Loader2, CreditCard, ShieldCheck 
} from 'lucide-react';
import BillingTab from '../settings/BillingTab';
import ManageAccessModal from '../settings/ManageAccessModal'; 

interface CompanyProfile {
  name: string;
  kra_pin: string;
  nssf_number: string;
  shif_number: string; 
  email?: string;
  address?: string;
  plan?: string;
  has_access?: boolean;
  subscription_expiry?: string;
  demo_runs_left?: number; 
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [showManageAccess, setShowManageAccess] = useState(false);

  // UI State
  const [notifications, setNotifications] = useState(true);
  const [housingLevy, setHousingLevy] = useState(true);
  const [shifEnabled, setShifEnabled] = useState(true);

  // Dark Mode State & Logic
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Data State
  const [formData, setFormData] = useState<CompanyProfile>({
    name: '',
    kra_pin: '',
    nssf_number: '',
    shif_number: '', 
    email: '',
    address: '',
    plan: 'DEMO',
    has_access: false,
    subscription_expiry: '',
    demo_runs_left: 0 
  });
  
  const [userPhone, setUserPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [userRes, companyRes] = await Promise.all([
           api.get('/users/me/'),
           api.get('/companies/')
        ]);
        
        if (userRes.data) {
           setUserPhone(userRes.data.phone_number);
        }

        if (companyRes.data.length > 0) {
            const company = companyRes.data[0];
            setFormData({
                name: company.name,
                kra_pin: company.kra_pin,
                nssf_number: company.nssf_number,
                shif_number: company.shif_number || '', 
                email: company.email || '', 
                address: company.address || '',
                plan: company.plan,
                has_access: company.is_active_subscription || (company.plan === 'DEMO' && company.demo_runs_left > 0),
                subscription_expiry: company.subscription_expiry,
                demo_runs_left: company.demo_runs_left 
            });
        }
    } catch (err) {
        console.error("Failed to load settings data", err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
        const listResponse = await api.get('/companies/');
        
        if (listResponse.data.length > 0) {
            const companyId = listResponse.data[0].id;
            await api.patch(`/companies/${companyId}/`, {
               name: formData.name,
               kra_pin: formData.kra_pin,
               nssf_number: formData.nssf_number,
               shif_number: formData.shif_number,
               email: formData.email,
               address: formData.address
            });
        } else {
            await api.post('/companies/', formData);
        }

        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);

    } catch (err) {
        console.error("Save failed", err);
        let errorMessage = 'Failed to save settings. Please check your inputs.';
        
        if (isAxiosError(err) && err.response?.data) {
            const errorData = err.response.data;
            if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                const key = Object.keys(errorData)[0];
                const msg = errorData[key];
                errorMessage = `${key.replace('_', ' ').toUpperCase()}: ${Array.isArray(msg) ? msg[0] : msg}`;
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        }

        setMessage({ type: 'error', text: errorMessage });
    } finally {
        setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'compliance', label: 'Tax & Compliance', icon: ShieldCheck },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 text-slate-900 dark:text-slate-100">
      <Header 
        title="Settings" 
        subtitle="Manage system configurations and compliance"
      />

      {/* Success/Error Toast */}
      {message && (
          <div className={`fixed top-10 right-10 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-top-5 z-50 ${
              message.type === 'success' ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-red-600 dark:bg-red-500'
          }`}>
              {message.text}
          </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700 mb-8 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-all
              ${activeTab === tab.id 
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-b-2 hover:border-slate-300 dark:hover:border-slate-600'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl space-y-8">
        
        {/* =========================================================
            TAB 1: COMPANY PROFILE 
            ========================================================= */}
        {activeTab === 'company' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Company Profile</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Basic information about your organization</p>
              </div>
            </div>
            
            {isLoading ? (
                <div className="p-10 text-center text-slate-400 dark:text-slate-500">Loading company details...</div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                      <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                          placeholder="e.g. SheriaFlow Ltd"
                      />
                  </div>

                  {/* KRA PIN */}
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company KRA PIN</label>
                      <input 
                          type="text" 
                          value={formData.kra_pin}
                          onChange={(e) => setFormData({...formData, kra_pin: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                          placeholder="e.g. P051..."
                      />
                  </div>

                  {/* NSSF Number */}
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">NSSF Employer Number</label>
                      <input 
                          type="text" 
                          value={formData.nssf_number}
                          onChange={(e) => setFormData({...formData, nssf_number: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                          placeholder="e.g. 123456"
                      />
                  </div>

                  {/* SHIF Number Input */}
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SHIF / SHA Number</label>
                      <input 
                          type="text" 
                          value={formData.shif_number}
                          onChange={(e) => setFormData({...formData, shif_number: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                          placeholder="e.g. SHA-000..."
                      />
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Email</label>
                      <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                      />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Physical Address</label>
                      <input 
                          type="text" 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                      />
                  </div>
              </div>
            )}
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 text-right">
              <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-900/10 dark:shadow-emerald-900/20 flex items-center gap-2 ml-auto disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: BILLING & PLANS
            ========================================================= */}
        {activeTab === 'billing' && (
          <BillingTab 
            user={{ 
              phone_number: userPhone, 
              company: {
                 plan: formData.plan,
                 has_access: formData.has_access,
                 subscription_expiry: formData.subscription_expiry,
                 demo_runs_left: formData.demo_runs_left 
              } 
            }} 
          />
        )}

        {/* =========================================================
            TAB 3: TAX, COMPLIANCE & SYSTEM (Combined)
            ========================================================= */}
        {activeTab === 'compliance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Tax & Compliance */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Tax & Compliance</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Manage statutory deductions and compliance settings</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Housing Levy */}
                <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${housingLevy ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Housing Levy</span>
                      <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">1.5%</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Affordable Housing Levy deduction from gross pay</p>
                  </div>
                  <button onClick={() => setHousingLevy(!housingLevy)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${housingLevy ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${housingLevy ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* SHIF */}
                <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${shifEnabled ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">SHIF (Social Health)</span>
                      <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full font-bold">2.75%</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Social Health Authority (SHA) compliance</p>
                  </div>
                  <button onClick={() => setShifEnabled(!shifEnabled)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${shifEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${shifEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* NSSF (Locked) */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 opacity-75">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">NSSF Contributions</span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">Tiered</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Mandatory statutory deduction (Locked)</p>
                  </div>
                  <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>

            {/* System Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg"><Bell size={20} /></div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Email Reports</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Send monthly P10 summaries</p>
                  </div>
                  <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"><Moon size={20} /></div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reduce eye strain</p>
                  </div>
                  <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Security - Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6 flex items-center justify-between transition-colors duration-200">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-red-900/30 rounded-full text-red-500 shadow-sm">
                     <AlertTriangle size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-red-900 dark:text-red-400">Danger Zone</h3>
                     <p className="text-red-700/80 dark:text-red-400/80 text-sm">Reset all payroll data or delete organization account</p>
                  </div>
               </div>
               
               <button 
                 onClick={() => setShowManageAccess(true)} 
                 className="px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-500 font-medium rounded-lg hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all text-sm"
               >
                  Manage Access
               </button>
            </div>

          </div>
        )}
      </div>

      <ManageAccessModal 
        isOpen={showManageAccess} 
        onClose={() => setShowManageAccess(false)} 
      />

    </div>
  );
};

export default Settings;