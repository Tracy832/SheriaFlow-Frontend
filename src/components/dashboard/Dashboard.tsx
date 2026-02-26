import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import StatCard from '../common/StatCard'; // Keeping your existing import
import PayrollChart from './PayrollChart';
import RecentActivity from './RecentActivity';
import RecentPayrolls from './RecentPayrolls';
import SubscriptionModal from '../subscription/SubscriptionModal'
import { Users, DollarSign, Calendar, ShieldCheck, Loader2 } from 'lucide-react'; // <--- Added Loader2
import api from '../../api/axios';


interface DashboardStats {
  total_employees: number;
  last_payroll_cost: number;
  pending_actions: number;
  payroll_trend: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_employees: 0,
    last_payroll_cost: 0,
    pending_actions: 0,
    payroll_trend: "0%"
  });

  const [isLoading, setIsLoading] = useState(true);
  
  // --- SUBSCRIPTION STATE ---
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  // Combined Fetch Logic
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch User Profile to check Subscription Status
      // We assume /users/me/ returns { company: { has_access: bool }, phone_number: "..." }
      const userRes = await api.get('/users/me/');
      const userData = userRes.data;
      
      setUserPhone(userData.phone_number);

      // If user has NO access (Plan expired or new account), show modal
      if (!userData.company?.has_access) {
          setShowSubscriptionModal(true);
      }

      // 2. Fetch Stats
      const statsRes = await api.get('/payroll/stats/');
      setStats(statsRes.data);

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper to format date
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Early Return for Loading State
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      
      {/* 1. Page Header */}
      <Header 
        title="Dashboard" 
        subtitle={today}
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Payroll Cost" 
          value={`KES ${stats.last_payroll_cost.toLocaleString()}`} 
          icon={DollarSign} 
          trend={stats.payroll_trend}
          trendUp={!stats.payroll_trend.includes('-')} 
        />
        <StatCard 
          title="Active Employees" 
          value={stats.total_employees.toString()} 
          icon={Users} 
          trend="+1 from last month"
          trendUp={true}
        />
        <StatCard 
          title="Next Pay Date" 
          value="Jan 28, 2026" 
          icon={Calendar} 
        />
        <StatCard 
          title="Compliance Status" 
          value="Compliant" 
          icon={ShieldCheck} 
          trend="Updated today"
          trendUp={true}
        />
      </div>

      {/* 3. Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[400px]">
        {/* Chart takes up 2/3 space */}
        <div className="lg:col-span-2 h-full">
          <PayrollChart />
        </div>
        {/* Activity Feed takes up 1/3 space */}
        <div className="h-full">
          <RecentActivity />
        </div>
      </div>

      {/* 4. Recent Transactions Table */}
      <div className="min-h-[400px]">
        <RecentPayrolls />
      </div>

      {/* --- THE GATEKEEPER MODAL --- */}
      {/* This will overlay everything if showSubscriptionModal is true */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        userPhone={userPhone}
        onSuccess={() => {
           setShowSubscriptionModal(false);
           // Refresh data to confirm access is now granted
           fetchDashboardData();
        }}
      />

    </div>
  );
};

export default Dashboard;