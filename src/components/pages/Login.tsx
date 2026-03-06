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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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

  // --- GOOGLE AUTH HANDLER ---
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/users/google/', {
        credential: credentialResponse.credential,
      });

      // Save tokens from our Django backend
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Redirect to Dashboard
      navigate('/');
    } catch (err) {
      console.error("Google Auth Failed on Backend", err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600 font-bold text-xl">
            S
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-slate-500 mt-2">Please enter your details to sign in</p>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">Remember me</label>
            </div>
            <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
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
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-sm text-slate-400 font-medium">Or continue with</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <div className="mt-6 flex justify-center w-full">
           <div className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-In failed')}
                useOneTap
                theme="outline"
                size="large"
                width="100%"
                text="continue_with"
              />
           </div>
        </div>
        {/* --------------------------- */}

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? 
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;