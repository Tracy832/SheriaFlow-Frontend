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

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Adjust Pay</h3>
            <p className="text-slate-500 text-xs">For {employeeName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Active Adjustments List */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Adjustments</h4>
            
            {fetching ? (
              <div className="text-center py-4 text-slate-400"><Loader2 size={16} className="animate-spin mx-auto" /></div>
            ) : existingAdjustments.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No manual adjustments for this month.</p>
            ) : (
              <div className="space-y-2">
                {existingAdjustments.map(adj => (
                  <div key={adj.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{adj.name}</p>
                      <p className={`text-xs font-medium ${adj.type === 'EARNING' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {adj.type === 'EARNING' ? '+' : '-'} KES {Number(adj.amount).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(adj.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Add New</h4>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Type Selection */}
            <div>
              <div className="grid grid-cols-2 gap-3">
                <label className={`
                  cursor-pointer border rounded-lg p-3 text-center transition-all
                  ${formData.type === 'EARNING' 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold ring-1 ring-emerald-500' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'}
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
                    ? 'bg-red-50 border-red-500 text-red-700 font-bold ring-1 ring-red-500' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input 
                type="text" 
                placeholder="e.g. Christmas Bonus" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (KES)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 font-bold text-slate-800"
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
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 rounded-lg"
              >
                Done
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-2 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
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