import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration logic here
    console.log("Registering:", formData);
    navigate('/'); // Redirect to dashboard after signup
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-8">
        
        {/* Header - Same as Login */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
            SF
          </div>
          <h1 className="text-2xl font-bold text-blue-700">SheriaFlow</h1>
          <p className="text-slate-500 text-sm mt-1">Create your Admin Account</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="John Kamau"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              required
              onChange={handleChange}
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input 
              type="text" 
              name="companyName"
              placeholder="SheriaFlow Ltd"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              required
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="you@company.co.ke"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              required
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 tracking-widest"
              required
              onChange={handleChange}
            />
          </div>

           {/* Confirm Password */}
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 tracking-widest"
              required
              onChange={handleChange}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900" required />
            <span className="text-xs text-slate-500">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </span>
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Link back to Login */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            Log in
          </Link>
        </p>

        {/* Footer */}
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

export default Register;