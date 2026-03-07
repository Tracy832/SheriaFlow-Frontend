import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Building2, Mail, Lock, Phone, 
  ArrowRight, Loader2, CheckCircle, Eye, EyeOff
} from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import api from '../../api/axios';
import { isAxiosError } from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '', 
    company_name: '', 
    password: '',
    confirm_password: ''
  });

  // Check dark mode for Google Button theme
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);
      
      await api.post('/users/register/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        company_name: formData.company_name,
        password: formData.password
      });

      navigate('/login', { state: { message: "Account created successfully! Please log in to complete setup." } });
      
    } catch (err: unknown) {
      console.error("Registration Error:", err);
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        const firstError = Object.values(data)[0]; 
        setError(Array.isArray(firstError) ? firstError[0] : "Registration failed. Please check your inputs.");
      } else {
        setError("Network error. Please try again later.");
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
      console.error("Google Auth Failed", err);
      setError('Google Sign-Up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "text-xs font-bold text-slate-700 dark:text-slate-300 uppercase";
  const inputClass = "w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const inputNoIconClass = "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      
      {/* LEFT SIDE: Branding & Trust */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 dark:bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden transition-colors border-r border-transparent dark:border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/20">S</div>
            <span className="text-xl font-bold tracking-tight">SheriaFlow</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Payroll compliance <br />
            <span className="text-emerald-400">made simple.</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-sm">
            Join 500+ Kenyan businesses automating KRA returns, NSSF, and M-Pesa payments today.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            "Automated P9 & P10 Generation",
            "Direct M-Pesa Disbursement",
            "Finance Act 2025 Ready"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="font-medium text-slate-200">{item}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* RIGHT SIDE: Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create your account</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-2 animate-in slide-in-from-top-1 transition-colors">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* --- GOOGLE AUTH BUTTON --- */}
            <div className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
               <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => setError('Google Sign-In failed')}
                 theme={isDarkMode ? "filled_blue" : "outline"}
                 size="large"
                 width="100%"
                 text="signup_with"
               />
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
              <span className="px-4 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">Or register with email</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    name="first_name" 
                    required 
                    onChange={handleChange} 
                    className={inputClass}
                    placeholder="John" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Last Name</label>
                <input 
                  name="last_name" 
                  required 
                  onChange={handleChange} 
                  className={inputNoIconClass}
                  placeholder="Kamau" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  name="company_name" 
                  required 
                  onChange={handleChange} 
                  className={inputClass}
                  placeholder="Acme Enterprises Ltd" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  onChange={handleChange} 
                  className={inputClass}
                  placeholder="john@company.com" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>
                Phone Number <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(For M-Pesa)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  name="phone_number" 
                  required 
                  onChange={handleChange} 
                  className={inputClass}
                  placeholder="0712345678" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Confirm</label>
                <input 
                  type="password" 
                  name="confirm_password" 
                  required 
                  onChange={handleChange} 
                  className={inputNoIconClass}
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 dark:shadow-emerald-900/20 flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'} 
              {!isLoading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
              By registering, you agree to our <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;