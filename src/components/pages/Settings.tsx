import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import api from '../../api/axios';
import { isAxiosError } from 'axios';
import { 
  Building2, Shield, Bell, Moon, Lock, 
  Save, AlertTriangle, Loader2 
} from 'lucide-react';

interface CompanyProfile {
  name: string;
  kra_pin: string;
  nssf_number: string;
  shif_number: string; 
  email?: string;
  address?: string;
}

const Settings = () => {
  // UI State
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [housingLevy, setHousingLevy] = useState(true);
  const [shifEnabled, setShifEnabled] = useState(true);

  // Data State
  const [formData, setFormData] = useState<CompanyProfile>({
    name: '',
    kra_pin: '',
    nssf_number: '',
    shif_number: '', // State exists, now we add the input for it
    email: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
        const response = await api.get('/companies/');
        
        if (response.data.length > 0) {
            const company = response.data[0];
            setFormData({
                name: company.name,
                kra_pin: company.kra_pin,
                nssf_number: company.nssf_number,
                shif_number: company.shif_number || '', 
                email: company.email || '', // Ensure we catch email if backend sends it
                address: company.address || '' 
            });
        }
    } catch (err) {
        console.error("Failed to load company settings", err);
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
            await api.patch(`/companies/${companyId}/`, formData);
        } else {
            await api.post('/companies/', formData);
        }

        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);

    } catch (err) {
        console.error("Save failed", err);
        let errorMessage = 'Failed to save settings. Please check your inputs.';
        
        if (isAxiosError(err)) {
            // This captures errors like {"shif_number": ["This field may not be blank"]}
            // and turns them into readable text
            const errorData = err.response?.data;
            if (errorData) {
                if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                    // Grab the first error message from the object
                    const key = Object.keys(errorData)[0];
                    const msg = errorData[key];
                    errorMessage = `${key.replace('_', ' ').toUpperCase()}: ${Array.isArray(msg) ? msg[0] : msg}`;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
            }
        }

        setMessage({ 
            type: 'error', 
            text: errorMessage
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <Header 
        title="Settings" 
        subtitle="Manage system configurations and compliance"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* Success/Error Toast */}
      {message && (
          <div className={`fixed top-10 right-10 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-top-5 z-50 ${
              message.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}>
              {message.text}
          </div>
      )}

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
          
          {isLoading ? (
              <div className="p-10 text-center text-slate-400">Loading company details...</div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" 
                        placeholder="e.g. SheriaFlow Ltd"
                    />
                </div>

                {/* KRA PIN */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company KRA PIN</label>
                    <input 
                        type="text" 
                        value={formData.kra_pin}
                        onChange={(e) => setFormData({...formData, kra_pin: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" 
                        placeholder="e.g. P051..."
                    />
                </div>

                {/* NSSF Number */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">NSSF Employer Number</label>
                    <input 
                        type="text" 
                        value={formData.nssf_number}
                        onChange={(e) => setFormData({...formData, nssf_number: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" 
                        placeholder="e.g. 123456"
                    />
                </div>

                {/* ✅ ADDED: SHIF Number Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">SHIF / SHA Number</label>
                    <input 
                        type="text" 
                        value={formData.shif_number}
                        onChange={(e) => setFormData({...formData, shif_number: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" 
                        placeholder="e.g. SHA-000..."
                    />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" 
                    />
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Physical Address</label>
                    <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 transition-all" 
                    />
                </div>
            </div>
          )}
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 ml-auto disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
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