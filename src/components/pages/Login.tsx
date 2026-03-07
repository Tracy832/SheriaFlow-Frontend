import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import api from '../../api/axios'; 
import { isAxiosError } from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check dark mode for Google Button theme
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Fixed: changed from setIsSubmitting to setIsLoading
    setError('');

    try {
        const response = await api.post('/token/', {
            email: formData.email,
            password: formData.password
        });

        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        navigate('/');

    } catch (err) {
        if (isAxiosError(err)) {
            const message = err.response?.data?.detail || 'Invalid credentials';
            setError(message);
        } else {
            setError('Something went wrong. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/users/google/', {
        credential: credentialResponse.credential,
      });

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      navigate('/');
    } catch (err) {
      console.error("Google Auth Failed on Backend", err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800 transition-all">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm transition-colors">
            S
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Please enter your details to sign in</p>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium border border-red-100 dark:border-red-900/30 transition-colors">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Email address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 text-emerald-600 dark:bg-slate-800 dark:border-slate-700 focus:ring-emerald-500 border-gray-300 rounded" 
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 transition-colors">Remember me</label>
            </div>
            {/* LINKED TO FORGOT PASSWORD PAGE */}
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                </>
            ) : (
                "Sign in"
            )}
          </button>
        </form>

        {/* --- GOOGLE AUTH SECTION --- */}
        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
          <span className="px-4 text-sm text-slate-400 dark:text-slate-500 font-medium transition-colors">Or continue with</span>
          <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <div className="mt-6 flex justify-center w-full">
           <div className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-In failed')}
                useOneTap
                theme={isDarkMode ? "filled_blue" : "outline"}
                size="large"
                width="100%"
                text="continue_with"
              />
           </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Don't have an account? 
          <Link to="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 ml-1 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;