import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and go to dashboard
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Logo Box */}
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
            SF
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-blue-700">SheriaFlow</h1>
          <p className="text-slate-500 text-sm mt-1">Payroll & Compliance System</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="you@company.co.ke"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 text-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 text-slate-800 tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
              <span className="text-sm text-slate-500">Remember me</span>
            </label>
            
            <a href="#" className="text-sm font-medium text-slate-900 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
          >
            Log in to portal
          </button>
        </form>
        
        {/* Link to Registration Page */}
        <p className="text-center text-sm text-slate-600 mt-6">
          New to SheriaFlow?{' '}
          <Link to="/register" className="font-semibold text-blue-700 hover:underline">
            Create an account
          </Link>
        </p>

        {/* Footer Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-2">
          <p className="text-sm font-medium text-slate-600">Secured by SheriaFlow</p>
          <p className="text-xs text-slate-400">
            © 2025 • Compliant with KRA & NSSF regulations
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;