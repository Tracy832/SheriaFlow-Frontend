import { useState, useEffect, useCallback } from 'react';
import { X, Loader2, Trash2 } from 'lucide-react';
import api from '../../api/axios';

interface AdjustmentsModalProps {
  runId: number;
  employeeId: number;
  employeeName: string;
  onClose: () => void;
  onSave: () => void; // Trigger refresh of parent table
}

interface Adjustment {
  id: number;
  name: string;
  amount: string;
  type: 'EARNING' | 'DEDUCTION';
  payroll_run: number;
  employee: number;
}

const AdjustmentsModal = ({ runId, employeeId, employeeName, onClose, onSave }: AdjustmentsModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'EARNING',
    description: ''
  });
  
  const [existingAdjustments, setExistingAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing adjustments for this specific employee in this run
  const fetchExistingAdjustments = useCallback(async () => {
    try {
      setFetching(true);
      const res = await api.get('/payroll/adjustments/');
      // Filter the global adjustments to just this run and employee
      const filtered = res.data.filter(
        (adj: Adjustment) => adj.payroll_run === runId && adj.employee === employeeId
      );
      setExistingAdjustments(filtered);
    } catch (err) {
      console.error("Failed to fetch adjustments", err);
    } finally {
      setFetching(false);
    }
  }, [runId, employeeId]);

  useEffect(() => {
    fetchExistingAdjustments();
  }, [fetchExistingAdjustments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/payroll/adjustments/', {
        payroll_run: runId,
        employee: employeeId,
        name: formData.name,
        amount: formData.amount,
        type: formData.type,
        description: formData.description
      });
      
      // Clear form, refresh the modal list, and refresh the parent table
      setFormData({ name: '', amount: '', type: 'EARNING', description: '' });
      await fetchExistingAdjustments();
      onSave(); 
    } catch (err) {
      console.error(err);
      setError("Failed to save adjustment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adjustmentId: number) => {
    try {
      await api.delete(`/payroll/adjustments/${adjustmentId}/`);
      // Refresh the modal list and the parent table so the math reverts!
      await fetchExistingAdjustments();
      onSave();
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Could not delete adjustment.");
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 transition-colors">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Adjust Pay</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">For {employeeName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Active Adjustments List */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 transition-colors">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Active Adjustments</h4>
            
            {fetching ? (
              <div className="text-center py-4 text-slate-400 dark:text-slate-500"><Loader2 size={16} className="animate-spin mx-auto" /></div>
            ) : existingAdjustments.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">No manual adjustments for this month.</p>
            ) : (
              <div className="space-y-2">
                {existingAdjustments.map(adj => (
                  <div key={adj.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{adj.name}</p>
                      <p className={`text-xs font-medium ${adj.type === 'EARNING' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {adj.type === 'EARNING' ? '+' : '-'} KES {Number(adj.amount).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(adj.id)}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                      title="Remove and Revert Math"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Add New</h4>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-500/20 transition-colors">
                {error}
              </div>
            )}

            {/* Type Selection */}
            <div>
              <div className="grid grid-cols-2 gap-3">
                <label className={`
                  cursor-pointer border rounded-lg p-3 text-center transition-all
                  ${formData.type === 'EARNING' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold ring-1 ring-emerald-500' 
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300'}
                `}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="EARNING" 
                    checked={formData.type === 'EARNING'} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="hidden"
                  />
                  Earning (+)
                </label>

                <label className={`
                  cursor-pointer border rounded-lg p-3 text-center transition-all
                  ${formData.type === 'DEDUCTION' 
                    ? 'bg-red-50 dark:bg-red-500/10 border-red-500 dark:border-red-500 text-red-700 dark:text-red-400 font-bold ring-1 ring-red-500' 
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300'}
                `}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="DEDUCTION" 
                    checked={formData.type === 'DEDUCTION'} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="hidden"
                  />
                  Deduction (-)
                </label>
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input 
                type="text" 
                placeholder="e.g. Christmas Bonus" 
                className={inputClass}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (KES)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className={`${inputClass} font-bold`}
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors"
              >
                Done
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Saving...' : 'Add Adjustment'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentsModal;