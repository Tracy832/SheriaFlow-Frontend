import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Building2, Mail, Lock, Phone, 
  ArrowRight, Loader2, CheckCircle, Eye, EyeOff
} from 'lucide-react';
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
    phone_number: '', // <--- REQUIRED for M-Pesa
    company_name: '', // <--- REQUIRED for Company Model
    password: '',
    confirm_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation
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
      
      // 2. API Call (Updated to send all required fields)
      await api.post('/users/register/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        company_name: formData.company_name,
        password: formData.password
      });

      // 3. Success -> Redirect to Login
      // We pass a state message so the Login page can show a green banner
      navigate('/login', { state: { message: "Account created successfully! Please log in to complete setup." } });
      
    } catch (err: unknown) {
      console.error("Registration Error:", err);
      if (isAxiosError(err) && err.response?.data) {
        // Handle varied Django error formats
        const data = err.response.data;
        // If it's a field error like { email: ["Exists"] } or generic { error: "Msg" }
        const firstError = Object.values(data)[0]; 
        setError(Array.isArray(firstError) ? firstError[0] : "Registration failed. Please check your inputs.");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* LEFT SIDE: Branding & Trust (Hidden on Mobile) */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900">S</div>
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

        {/* Value Props */}
        <div className="relative z-10 space-y-4">
          {[
            "Automated P9 & P10 Generation",
            "Direct M-Pesa Disbursement",
            "Finance Act 2025 Ready"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* RIGHT SIDE: Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
            <p className="text-slate-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-1">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input 
                    name="first_name" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" 
                    placeholder="John" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Last Name</label>
                <input 
                  name="last_name" 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" 
                  placeholder="Kamau" 
                />
              </div>
            </div>

            {/* Company & Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  name="company_name" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="Acme Enterprises Ltd" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="john@company.com" 
                />
              </div>
            </div>

            {/* Phone (Crucial for M-Pesa) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Phone Number <span className="text-slate-400 font-normal">(For M-Pesa)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  name="phone_number" 
                  required 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="0712345678" 
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    required 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Confirm</label>
                <input 
                  type="password" 
                  name="confirm_password" 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'} 
              {!isLoading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              By registering, you agree to our <a href="#" className="underline hover:text-slate-600">Terms</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;  