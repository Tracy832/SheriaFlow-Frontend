import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { isAxiosError } from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Replace with your actual backend password reset endpoint
      await api.post('/users/password-reset/', { email });
      setIsSent(true);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800 transition-all">
        
        {/* Back to Login */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">
            <Mail size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot password?</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {isSent ? (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-xl mb-6">
              <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
              <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">
                Reset link sent to <br />
                <span className="font-bold">{email}</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setIsSent(false)} 
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium border border-red-100 dark:border-red-900/30 transition-colors">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Sending...
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

export default ForgotPassword;