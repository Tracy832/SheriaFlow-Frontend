import { useState } from 'react';
import { CheckCircle, Shield, AlertTriangle, Calendar, CreditCard, Clock } from 'lucide-react';
import SubscriptionModal from '../subscription/SubscriptionModal'; 

// --- TYPESCRIPT INTERFACES ---
interface CompanyDetails {
  plan?: string;
  has_access?: boolean;
  subscription_expiry?: string | null;
  demo_runs_left?: number;
}

interface UserProfile {
  phone_number?: string;
  company?: CompanyDetails;
}

interface BillingTabProps {
  user: UserProfile | null | undefined;
}

const BillingTab = ({ user }: BillingTabProps) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const company: CompanyDetails = user?.company || {};
  const currentPlan = company.plan || 'DEMO';
  const isActive = company.has_access || false;

  // Helper to determine styling for the pricing cards
  const isPlanActive = (planType: string) => currentPlan === planType && isActive;

  // Date & Time Calculations
  const getDaysRemaining = () => {
    if (!company.subscription_expiry) return 0;
    const expiry = new Date(company.subscription_expiry);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24))); 
  };

  const daysLeft = getDaysRemaining();
  
  // Format the expiry date
  const nextBillingDate = company.subscription_expiry 
    ? new Date(company.subscription_expiry).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'N/A';

  // Plan Details Mapping
  const planDetails: Record<string, { name: string, price: string, interval: string }> = {
    'DEMO': { name: 'Trial Demo', price: 'FREE', interval: 'One-time' },
    'MONTHLY': { name: 'Monthly Plan', price: 'KES 2,500', interval: 'per month' },
    'ANNUAL': { name: 'Annual Plan', price: 'KES 25,000', interval: 'per year' },
  };

  const activePlanDetails = planDetails[currentPlan] || planDetails['DEMO'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* =========================================================
          1. CURRENT PLAN OVERVIEW
          ========================================================= */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Current Subscription</h3>
        <div className={`
          p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6
          ${isActive ? 'bg-white border-emerald-100 shadow-sm shadow-emerald-500/5' : 'bg-amber-50 border-amber-200'}
        `}>
          
          {/* Plan Info */}
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className={`
              p-4 rounded-xl flex items-center justify-center
              ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-600'}
            `}>
              {isActive ? <Shield size={32} /> : <AlertTriangle size={32} />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-2xl font-bold text-slate-900">{activePlanDetails.name}</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isActive ? 'Active' : 'Expired'}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {activePlanDetails.price} <span className="text-slate-400 font-normal">{activePlanDetails.interval}</span>
              </p>
            </div>
          </div>

          {/* Billing Dates & Days Left */}
          {currentPlan !== 'DEMO' && (
            <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Next Billing
                </p>
                <p className="font-bold text-slate-800">{isActive ? nextBillingDate : 'Payment Required'}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock size={12} /> Time Remaining
                </p>
                <p className={`font-bold ${daysLeft < 5 ? 'text-red-500' : 'text-slate-800'}`}>
                  {isActive ? `${daysLeft} Days` : '0 Days'}
                </p>
              </div>
            </div>
          )}

          {currentPlan === 'DEMO' && (
             <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CreditCard size={12} /> Demo Credits
                  </p>
                  <p className="font-bold text-slate-800">
                    {company.demo_runs_left || 0} Payroll Run(s) Left
                  </p>
                </div>
             </div>
          )}

          {/* Action Button */}
          <div className="w-full md:w-auto flex justify-end">
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className={`
                w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2
                ${isActive 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'}
              `}
            >
              {isActive ? 'Manage / Upgrade' : 'Renew Subscription'}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. UPGRADE CARDS
          ========================================================= */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* --- CARD 1: DEMO --- */}
          <div className={`
            relative p-6 rounded-2xl border-2 transition-all duration-200
            ${currentPlan === 'DEMO' ? 'border-slate-400 bg-slate-50 ring-1 ring-slate-400' : 'border-slate-100 bg-white hover:border-slate-300 opacity-60'}
          `}>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">Demo</h4>
            </div>
            <p className="text-slate-500 text-sm mb-6 h-10">
              Try the system with 1 free payroll run. No commitment.
            </p>
            <div className="space-y-3 mb-8">
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-slate-400"/> 1 Payroll Run</li>
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-slate-400"/> Basic Reports</li>
            </div>
            <button disabled className="w-full py-2 rounded-lg bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed">
              {currentPlan === 'DEMO' ? 'Current Plan' : 'Single Use Only'}
            </button>
          </div>

          {/* --- CARD 2: MONTHLY --- */}
          <div className={`
            relative p-6 rounded-2xl border-2 transition-all duration-200
            ${isPlanActive('MONTHLY') 
              ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500' 
              : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5'}
          `}>
             {isPlanActive('MONTHLY') && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  CURRENT PLAN
                </div>
             )}
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Flexible</span>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">
                KES 2,500 <span className="text-sm font-medium text-slate-400">/mo</span>
              </h4>
            </div>
            <p className="text-slate-500 text-sm mb-6 h-10">
              Perfect for SMEs. Pay as you go. Cancel anytime.
            </p>
            <div className="space-y-3 mb-8">
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Unlimited Runs</li>
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> M-Pesa Integration</li>
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> KRA & NSSF Reports</li>
            </div>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors
                ${isPlanActive('MONTHLY') 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'}
              `}
            >
              {isPlanActive('MONTHLY') ? 'Extend Subscription' : 'Choose Monthly'}
            </button>
          </div>

          {/* --- CARD 3: ANNUAL --- */}
          <div className={`
            relative p-6 rounded-2xl border-2 transition-all duration-200
            ${isPlanActive('ANNUAL') 
              ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500' 
              : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5'}
          `}>
             {isPlanActive('ANNUAL') && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  CURRENT PLAN
                </div>
             )}
             {!isPlanActive('ANNUAL') && (
                <div className="absolute -top-3 right-6 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200">
                  SAVE 17%
                </div>
             )}
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Best Value</span>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">
                KES 25,000 <span className="text-sm font-medium text-slate-400">/yr</span>
              </h4>
            </div>
            <p className="text-slate-500 text-sm mb-6 h-10">
              For established businesses. Get 2 months free.
            </p>
            <div className="space-y-3 mb-8">
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Everything in Monthly</li>
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Priority Support</li>
               <li className="flex gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Audit Logs</li>
            </div>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors
                ${isPlanActive('ANNUAL') 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'}
              `}
            >
              {isPlanActive('ANNUAL') ? 'Extend Subscription' : 'Choose Annual'}
            </button>
          </div>

        </div>
      </div>

      <SubscriptionModal 
        isOpen={showUpgradeModal} 
        userPhone={user?.phone_number} 
        onSuccess={() => {
           setShowUpgradeModal(false);
           window.location.reload(); 
        }}
      />
    </div>
  );
};

export default BillingTab;