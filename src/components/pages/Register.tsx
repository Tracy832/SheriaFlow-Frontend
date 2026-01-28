import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import api from '../../api/axios';  
import { isAxiosError } from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Success state to show a confirmation message before redirecting
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }

    setIsLoading(true);

    try {
        // 2. API Call
        // Note: Adjust the endpoint ('/register/') to match your Django URL
        await api.post('/register/', {
            name: formData.fullName, 
            email: formData.email,
            password: formData.password
        });

        // 3. Success Handling
        setIsSuccess(true);
        
        // Optional: Auto-redirect after 2 seconds
        setTimeout(() => {
            navigate('/login');
        }, 2000);

    } catch (err) {
        console.error("Registration Error:", err);
        if (isAxiosError(err)) {
            // Handle Django validation errors (e.g., "Email already exists")
            const backendError = err.response?.data;
            if (backendError?.email) {
                setError(backendError.email[0]);
            } else if (backendError?.password) {
                setError(backendError.password[0]);
            } else {
                setError('Registration failed. Please try again.');
            }
        } else {
            setError('Network error. Please check your connection.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  // Render Success State
  if (isSuccess) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
                <p className="text-slate-500 mb-6">Your account has been successfully registered. Redirecting you to login...</p>
                <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                    Go to Login
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600 font-bold text-xl">
            S
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
          <p className="text-slate-500 mt-2">Start managing your payroll efficiently</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="John Kamau"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="john@company.com"
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                </>
            ) : (
                "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? 
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 ml-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;