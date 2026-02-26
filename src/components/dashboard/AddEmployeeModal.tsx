import { useState } from 'react';
import { X, Loader2, Save, Calculator } from 'lucide-react';
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
    transport_allowance: '0',
    other_allowances: '0',
    joining_date: '',
    termination_date: ''
  });

  // Calculate Gross Pay Live for Preview
  const grossPay = (
    (parseFloat(formData.basic_salary) || 0) + 
    (parseFloat(formData.house_allowance) || 0) + 
    (parseFloat(formData.transport_allowance) || 0) + 
    (parseFloat(formData.other_allowances) || 0)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // --- FIX: Sanitize Data before sending ---
    const payload = {
        ...formData,
        // 1. Force KRA PIN to Uppercase
        kra_pin: formData.kra_pin.toUpperCase(),
        
        // 2. Convert empty date strings to null so Django doesn't crash
        joining_date: formData.joining_date || null,
        termination_date: formData.termination_date || null,
        
        // 3. Ensure numeric fields are numbers (optional safety check)
        basic_salary: formData.basic_salary || 0,
        house_allowance: formData.house_allowance || 0,
        transport_allowance: formData.transport_allowance || 0,
        other_allowances: formData.other_allowances || 0,
    };

    try {
      await api.post('/employees/', payload);
      onSuccess(); // Close modal and refresh list
    } catch (err) {
      console.error(err);
      
      let errorMessage = "Failed to create employee. Check inputs.";
      
      if (isAxiosError(err) && err.response?.data) {
          const data = err.response.data;
          // Handle specific field errors (like KRA PIN format)
          if (data.kra_pin) errorMessage = `KRA PIN Error: ${data.kra_pin[0]}`;
          else if (data.termination_date) errorMessage = `Date Error: ${data.termination_date[0]}`;
          else errorMessage = data.detail || data.message || JSON.stringify(data);
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
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 font-medium">
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
            <div className="md:col-span-2 pt-4 mt-2 border-t border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                 Contract Dates
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-slate-700 mb-1">
                     Joining Date <span className="text-red-500">*</span>
                   </label>
                   <input 
                     type="date" 
                     name="joining_date" 
                     value={formData.joining_date || ''} 
                     onChange={handleChange} 
                     className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" 
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-700 mb-1">
                     Termination Date <span className="text-slate-400 font-normal">(Optional)</span>
                   </label>
                   <input 
                     type="date" 
                     name="termination_date" 
                     value={formData.termination_date || ''} 
                     onChange={handleChange} 
                     className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 bg-slate-50" 
                   />
                   <p className="text-[10px] text-slate-500 mt-1">
                     Leave blank for permanent staff. Pay stops after this date.
                   </p>
                 </div>
               </div>
            </div>
            {/* ------------------------------------------ */}

            {/* --- FINANCIALS SECTION --- */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Basic Salary (KES)</label>
                        <input name="basic_salary" type="number" required onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">House Allowance</label>
                        <input name="house_allowance" type="number" value={formData.house_allowance} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">Transport Allowance</label>
                        <input name="transport_allowance" type="number" value={formData.transport_allowance} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">Other Allowances</label>
                        <input name="other_allowances" type="number" value={formData.other_allowances} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>

                {/* Gross Pay Preview */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Calculator size={16}/>
                        <span className="text-xs font-medium">Total Gross Pay</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                        KES {grossPay.toLocaleString()}
                    </span>
                </div>
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