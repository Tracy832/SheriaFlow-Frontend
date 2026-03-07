import { useState } from 'react';
import { CheckCircle, ShieldCheck, Zap, Loader2, Smartphone } from 'lucide-react';
import api from '../../api/axios';
import { isAxiosError } from 'axios';

interface SubscriptionModalProps {
  isOpen: boolean;
  userPhone?: string; 
  onSuccess: () => void; 
}

const SubscriptionModal = ({ isOpen, userPhone = '', onSuccess }: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'DEMO' | 'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [phoneNumber, setPhoneNumber] = useState(userPhone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'WAITING_FOR_PIN' | 'SUCCESS'>('IDLE');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setError('');
    setIsProcessing(true);

    try {
      if (selectedPlan === 'DEMO') {
        await api.post('/users/subscription/demo/');
        alert("Demo Activated! You have 1 free payroll run.");
        onSuccess();
      } else {
        if (!phoneNumber) {
          setError("Please enter a valid M-Pesa phone number.");
          setIsProcessing(false);
          return;
        }

        const response = await api.post('/users/subscription/initiate/', {
          plan_type: selectedPlan,
          phone_number: phoneNumber
        });

        if (response.data.checkout_request_id) {
          setPaymentStatus('WAITING_FOR_PIN');
          alert(`STK Push sent to ${phoneNumber}. Please enter your M-Pesa PIN.`);
          
          setTimeout(() => {
             setPaymentStatus('SUCCESS');
             onSuccess(); 
          }, 5000); 
        }
      }
    } catch (err: unknown) {
      console.error(err);
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || "Transaction failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px] border border-transparent dark:border-slate-700 transition-colors">
        
        {/* LEFT SIDE: Value Prop */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 md:w-5/12 flex flex-col justify-between relative overflow-hidden transition-colors">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Upgrade to SheriaFlow Pro</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">Automate your Kenyan payroll compliance and say goodbye to manual KRA errors.</p>
            
            <ul className="space-y-4">
              {[
                "Unlimited Payroll Runs",
                "Automated P9 & P10 Forms",
                "Direct M-Pesa Disbursement",
                "Employee Self-Service Portal",
                "Priority Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                    <CheckCircle size={16} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-600 mb-2">
              <ShieldCheck size={14} /> Bank-Grade Security
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-700">Your data is encrypted and stored securely.</p>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* RIGHT SIDE: Selection Form */}
        <div className="p-8 md:w-7/12 bg-slate-50 dark:bg-slate-900 overflow-y-auto transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-6">Choose your plan</h3>

          {/* PLAN CARDS */}
          <div className="space-y-4 mb-8">
            
            {/* MONTHLY */}
            <label className={`
              relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
              ${selectedPlan === 'MONTHLY' 
                ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-md' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-500/50'}
            `}>
              <input 
                type="radio" 
                name="plan" 
                value="MONTHLY" 
                checked={selectedPlan === 'MONTHLY'} 
                onChange={() => setSelectedPlan('MONTHLY')}
                className="hidden" 
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedPlan === 'MONTHLY' ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                {selectedPlan === 'MONTHLY' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Monthly Plan</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">KES 2,500<span className="text-slate-400 dark:text-slate-500 text-xs font-normal">/mo</span></span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Perfect for SMEs. Cancel anytime.</p>
              </div>
            </label>

            {/* ANNUAL */}
            <label className={`
              relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
              ${selectedPlan === 'ANNUAL' 
                ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-md' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-500/50'}
            `}>
              <input 
                type="radio" 
                name="plan" 
                value="ANNUAL" 
                checked={selectedPlan === 'ANNUAL'} 
                onChange={() => setSelectedPlan('ANNUAL')}
                className="hidden" 
              />
              <div className="absolute -top-3 right-4 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                SAVE 17%
              </div>
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedPlan === 'ANNUAL' ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                {selectedPlan === 'ANNUAL' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Annual Plan</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">KES 25,000<span className="text-slate-400 dark:text-slate-500 text-xs font-normal">/yr</span></span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Best value. 2 months free.</p>
              </div>
            </label>

            {/* DEMO */}
            <label className={`
              relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
              ${selectedPlan === 'DEMO' 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/50'}
            `}>
              <input 
                type="radio" 
                name="plan" 
                value="DEMO" 
                checked={selectedPlan === 'DEMO'} 
                onChange={() => setSelectedPlan('DEMO')}
                className="hidden" 
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedPlan === 'DEMO' ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600'}`}>
                {selectedPlan === 'DEMO' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Zap size={14} className="text-amber-500 fill-amber-500"/> Trial Demo</span>
                  <span className="font-bold text-slate-900 dark:text-white">FREE</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">1 Full Payroll Run. No credit card needed.</p>
              </div>
            </label>
          </div>

          {/* PAYMENT INPUT */}
          {selectedPlan !== 'DEMO' && (
            <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2">M-Pesa Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07XXXXXXXX" 
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">You will receive an M-Pesa PIN prompt on this number.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-100 dark:border-red-800/30 flex items-center gap-2 transition-colors">
               <span>⚠️</span> {error}
            </div>
          )}

          {paymentStatus === 'WAITING_FOR_PIN' ? (
             <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-xl text-center animate-pulse transition-colors">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">Check your Phone!</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-500">Enter your M-Pesa PIN to complete payment.</p>
                <div className="mt-3 flex justify-center">
                   <Loader2 className="animate-spin text-emerald-500" />
                </div>
             </div>
          ) : (
            <button 
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${selectedPlan === 'DEMO' ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-indigo-500/20' : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-500/20'}
                ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : null}
              {selectedPlan === 'DEMO' ? 'Start Free Demo' : `Pay KES ${selectedPlan === 'MONTHLY' ? '2,500' : '25,000'}`}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;