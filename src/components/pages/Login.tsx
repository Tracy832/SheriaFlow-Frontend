// src/components/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // SIMULATION LOGIC
    setTimeout(() => {
      // 1. Simple Validation Mock
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        setIsLoading(false);
        return;
      }

      // 2. "Save" the Fake Token (This is the Key!)
      localStorage.setItem('accessToken', 'simulation-token-123');
      
      // 3. Redirect to Dashboard
      setIsLoading(false);
      navigate('/');
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 max-w-md w-full p-8 transition-all hover:shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center text-white font-bold text-xl mb-4 transform transition-transform hover:scale-105">
            SF
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to SheriaFlow Portal</p>
        </div>

        {/* Mock Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400 text-slate-800"
                placeholder="demo@sheriaflow.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-800 tracking-widest"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? <><Loader2 className="animate-spin" size={20} /><span>Signing in...</span></> : "Log in to portal"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Start free trial</Link>
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 uppercase font-medium">
           Secured by SheriaFlow
        </div>
      </div>
    </div>
  );
};

export default Login;