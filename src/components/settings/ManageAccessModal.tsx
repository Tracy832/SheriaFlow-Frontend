import { useState } from 'react';
import { X, Key, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageAccessModal = ({ isOpen, onClose }: ManageAccessModalProps) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'menu' | 'password' | 'delete'>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [deleteConfirm, setDeleteConfirm] = useState('');

  if (!isOpen) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (passwords.new !== passwords.confirm) {
      return setError("New passwords do not match.");
    }

    setIsLoading(true);
    try {
      await api.post('/users/change-password/', {
        old_password: passwords.old,
        new_password: passwords.new
      });
      setSuccess("Password successfully updated.");
      setPasswords({ old: '', new: '', confirm: '' });
      setTimeout(() => { onClose(); setView('menu'); }, 2000);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to update password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      return setError("Please type DELETE to confirm.");
    }
    
    setIsLoading(true);
    try {
      await api.delete('/users/delete-account/');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch {
      setError("Failed to delete account. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">
            {view === 'menu' && 'Manage Access'}
            {view === 'password' && 'Change Password'}
            {view === 'delete' && 'Delete Account'}
          </h3>
          <button onClick={() => { onClose(); setView('menu'); setError(''); setSuccess(''); }} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <X size={18} />
          </button>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        {success && <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100">{success}</div>}

        <div className="p-6">
          
          {view === 'menu' && (
            <div className="space-y-4">
              <button onClick={() => setView('password')} className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-lg"><Key size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900">Change Password</h4>
                  <p className="text-xs text-slate-500">Update your login credentials securely</p>
                </div>
              </button>

              <button onClick={() => setView('delete')} className="w-full flex items-center gap-4 p-4 border border-red-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all text-left group">
                <div className="p-3 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100"><Trash2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-red-600">Delete Account & Data</h4>
                  <p className="text-xs text-red-500/80">Permanently erase your organization</p>
                </div>
              </button>
            </div>
          )}

          {view === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Old Password</label>
                <input type="password" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                <input type="password" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
                <input type="password" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setView('menu'); setError(''); }} className="flex-1 px-4 py-2 border rounded-lg text-slate-600 font-bold hover:bg-slate-50">Back</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 flex justify-center items-center gap-2">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Update'}
                </button>
              </div>
            </form>
          )}

          {view === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 text-sm">
                <AlertTriangle size={24} className="shrink-0 text-red-500" />
                <p>This action cannot be undone. This will permanently delete your user profile, company details, and all associated payroll records.</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type <span className="text-red-500">DELETE</span> to confirm</label>
                <input type="text" className="w-full px-4 py-2 border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setView('menu'); setError(''); }} className="flex-1 px-4 py-2 border rounded-lg text-slate-600 font-bold hover:bg-slate-50">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={isLoading || deleteConfirm !== 'DELETE'} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Delete Permanently'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManageAccessModal;