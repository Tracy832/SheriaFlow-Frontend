import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import api from '../../api/axios';
import { isAxiosError } from 'axios'; 

interface AddEmployeeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddEmployeeModal = ({ onClose, onSuccess }: AddEmployeeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    national_id: '',
    kra_pin: '',
    email: '',
    phone_number: '',
    department: 'General',
    role: 'Staff',
    basic_salary: '',
    house_allowance: '0',
    transport_allowance: '0'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/employees/', formData);
      onSuccess(); // Close modal and refresh list
    } catch (err) {
      console.error(err);
      
      // --- FIXED ERROR HANDLING ---
      let errorMessage = "Failed to create employee. Check inputs.";
      
      if (isAxiosError(err) && err.response?.data) {
          // If backend returns a specific error message or detail
          const data = err.response.data;
          errorMessage = data.detail || data.message || JSON.stringify(data);
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Add New Employee</h3>
            <p className="text-slate-500 text-sm">Enter personal and contract details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form id="add-employee-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Personal Details */}
            <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Personal Info</div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <input name="first_name" required onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <input name="last_name" required onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input name="email" type="email" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input name="phone_number" onChange={handleChange} placeholder="07XXXXXXXX" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>

            {/* Statutory */}
            <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Statutory Info</div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">National ID</label>
              <input name="national_id" required onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">KRA PIN</label>
              <input name="kra_pin" required onChange={handleChange} placeholder="A00..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>

            {/* Job & Pay */}
            <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Job & Compensation</div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Department</label>
              <select name="department" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="General">General</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Role Title</label>
              <input name="role" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Basic Salary (KES)</label>
              <input name="basic_salary" type="number" required onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800" />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
           <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
             Cancel
           </button>
           <button 
             form="add-employee-form"
             type="submit" 
             disabled={isSubmitting}
             className="px-6 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 disabled:opacity-70"
           >
             {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
             {isSubmitting ? 'Saving...' : 'Save Employee'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default AddEmployeeModal;