import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { isAxiosError } from 'axios';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams(); // Grabs variables from the URL
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Backend endpoint usually looks like: /users/password-reset-confirm/
      await api.post('/users/password-reset-confirm/', {
        uid,
        token,
        new_password: formData.new_password
      });
      setIsSuccess(true);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || 'The reset link is invalid or has expired.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800 transition-all">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Set new password</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-xl mb-6">
              <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
              <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">
                Password reset successful!
              </p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all"
            >
              Continue to Login <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium border border-red-100 dark:border-red-900/30 transition-colors">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                  value={formData.new_password}
                  onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input 
                type="password"
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !formData.new_password}
              className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;