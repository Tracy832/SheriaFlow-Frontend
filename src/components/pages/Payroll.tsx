import { useState, useCallback, useEffect } from 'react';
import Header from '../layout/Header';
import api from '../../api/axios'; 
import AdjustmentsModal from '../dashboard/AdjustmentModal';
import { 
  CheckCircle, ChevronRight, Smartphone, Building2, 
  Loader2, Search, FileText, PlusCircle, Lock
} from 'lucide-react';
import { isAxiosError } from 'axios';

// --- Interfaces ---

interface PayrollAPIData {
  id: string;
  payroll_run: number; 
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    department?: string;
  };
  basic_salary_snapshot: string | number;
  gross_pay: string | number;
  paye_tax: string | number;
  nssf_deduction: string | number;
  shif_deduction: string | number;
  housing_levy: string | number;
  net_pay: string | number;
  is_paid: boolean;
}

interface PayrollRecord {
  id: string;
  runId: number;      
  employeeId: number; 
  employee: string;
  role: string;
  department: string;
  basicSalary: number;
  grossPay: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Processing';
}

interface PayrollSummary {
  runId: number | null; 
  isLocked: boolean;    
  totalGross: number;
  totalEmployees: number;
  totalPaye: number;
  totalShif: number;
  totalHousing: number;
  totalNssf: number;
  totalDeductions: number;
  totalNetPay: number;
}

const formatCurrency = (amount: number) => "KES " + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Payroll = () => {
  const [step, setStep] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2026);
  // --- STATE FOR RUN TYPE ---
  const [runType, setRunType] = useState<'REGULAR' | 'OFF_CYCLE'>('REGULAR');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary>({
    runId: null, isLocked: false,
    totalGross: 0, totalEmployees: 0, totalPaye: 0, totalShif: 0, 
    totalHousing: 0, totalNssf: 0, totalDeductions: 0, totalNetPay: 0
  });

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentTarget, setAdjustmentTarget] = useState<{runId: number, employeeId: number, name: string} | null>(null);

  // --- Helper to fetch data ---
  const fetchPayroll = useCallback(async () => {
    try {
      setIsLoading(true);
      // ✅ FIX: Use backticks for string interpolation to send the actual runType
      const response = await api.get(`/payroll/payroll/?run_type=${runType}`);
      
      let gross = 0, paye = 0, shif = 0, housing = 0, nssf = 0, net = 0;
      let currentRunId: number | null = null;

      const mappedData: PayrollRecord[] = response.data.map((item: PayrollAPIData) => {
        const iGross = Number(item.gross_pay || 0);
        const iPaye = Number(item.paye_tax || 0);
        const iNssf = Number(item.nssf_deduction || 0);
        const iShif = Number(item.shif_deduction || 0);
        const iHousing = Number(item.housing_levy || 0);
        const iNet = Number(item.net_pay || 0);

        gross += iGross; paye += iPaye; nssf += iNssf; 
        shif += iShif; housing += iHousing; net += iNet;

        if (currentRunId === null) currentRunId = item.payroll_run;

        let empName = "Unknown";
        let empId = 0;
        if (item.employee && typeof item.employee === 'object') {
            empName = `${item.employee.first_name} ${item.employee.last_name}`;
            empId = item.employee.id;
        }

        const basic = Number(item.basic_salary_snapshot || 0);
        const allowances = Math.max(0, iGross - basic);

        return {
          id: item.id,
          runId: item.payroll_run,
          employeeId: empId,
          employee: empName,
          role: "Staff",
          department: item.employee?.department || "General",
          basicSalary: basic,
          grossPay: iGross,
          allowances: allowances,
          deductions: iPaye + iNssf + iShif + iHousing,
          netPay: iNet,
          status: item.is_paid ? 'Paid' : 'Pending',
        };
      });

      setPayrollData(mappedData);
      setSummary(prev => ({
        ...prev,
        runId: currentRunId,
        totalGross: gross,
        totalEmployees: mappedData.length,
        totalPaye: paye,
        totalShif: shif,
        totalHousing: housing,
        totalNssf: nssf,
        totalDeductions: paye + shif + housing + nssf,
        totalNetPay: net
      }));

    } catch (err) {
      console.error("Failed to load payroll", err);
    } finally {
      setIsLoading(false);
    }
  }, [runType]); // Re-fetch if runType changes

  // Load initial data
  useEffect(() => {
      fetchPayroll();
  }, [fetchPayroll]);

  // --- Actions ---

  // ✅ UPDATED: Handle Generate with Fraud Detection Override
  const handleGeneratePayroll = async (override = false) => {
    try {
      setIsProcessing(true);
      
      // We pass 'confirm_override: true' only if the user explicitly agreed after a warning
      await api.post('/payroll/generate/', { 
          month: selectedMonth, 
          year: selectedYear,
          run_type: runType,
          confirm_override: override 
      });

      await fetchPayroll();
      setSummary(prev => ({ ...prev, isLocked: false })); 
      setStep(2); 

    } catch (err: unknown) {
      console.error(err);
      
      if (isAxiosError(err) && err.response?.data) {
          const data = err.response.data;

          // --- HANDLE FRAUD WARNINGS ---
          if (data.error_code === "FRAUD_DETECTED") {
              const warnings = Array.isArray(data.warnings) ? data.warnings.join("\n\n") : data.warnings;
              const message = `Security Alert: Unusual Salary Spikes Detected!\n\n${warnings}\n\nDo you want to proceed anyway?`;
              
              if (window.confirm(message)) {
                  // User clicked "OK", so we call this function again with override=true
                  handleGeneratePayroll(true);
                  return;
              }
          } 
          // --- HANDLE LOCKED PAYROLL ---
          else if (data.error) {
              alert(data.error);
          } else {
              alert("Failed to generate payroll.");
          }
      } else {
          alert("An unexpected error occurred.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- LOCK FUNCTION ---
  const handleLockPayroll = async () => {
    if (!summary.runId) return;
    
    const confirm = window.confirm("Are you sure you want to LOCK this payroll? \n\nThis will prevent any further adjustments or recalculations.");
    if (!confirm) return;

    try {
      setIsProcessing(true);
      await api.post(`/payroll/runs/${summary.runId}/lock/`);
      setSummary(prev => ({ ...prev, isLocked: true })); // Update UI state
      alert("Payroll has been locked successfully.");
    } catch (err: unknown) {
      console.error(err);
      if (isAxiosError(err) && err.response?.data?.error === "This payroll is already locked.") {
          setSummary(prev => ({ ...prev, isLocked: true }));
          alert("This payroll is already locked.");
      } else {
          alert("Failed to lock payroll.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMpesaDisbursement = async () => {
    try {
        setIsProcessing(true);
        await api.post('/payroll/disburse/mpesa/', { month: selectedMonth, year: selectedYear });
        alert("STK Pushes initiated successfully!");
        setStep(1); 
    } catch (error) {
        console.error("M-Pesa failed", error);
        alert("Failed to initiate M-Pesa payments.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
        setIsProcessing(true);
        alert("Marking as paid (Manual)...");
        setStep(1);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDownloadFile = async (url: string, filename: string) => {
    try {
        setIsProcessing(true);
        const response = await api.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { 
            type: filename.endsWith('.pdf') 
                ? 'application/pdf' 
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename); 
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
        console.error("Download failed", err);
        alert("Failed to download file.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleOpenAdjustment = (record: PayrollRecord) => {
      // Prevent adjustments if locked
      if (summary.isLocked) {
          alert("This payroll is locked. You cannot make adjustments.");
          return;
      }
      setAdjustmentTarget({
          runId: record.runId,
          employeeId: record.employeeId,
          name: record.employee
      });
      setIsAdjustmentModalOpen(true);
  };

  // --- Components ---
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
            ${step >= s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}
          `}>
            {step > s ? <CheckCircle size={16} /> : s}
          </div>
          <span className={`ml-3 text-sm font-medium hidden md:block ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
            {s === 1 ? 'Select Period' : s === 2 ? 'Review Calculation' : 'Disburse'}
          </span>
          {s < 3 && <div className="w-12 h-px bg-slate-200 mx-4 hidden md:block" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      <Header 
        title="Payroll Processing" 
        subtitle="Process monthly salaries and manage disbursements"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      <StepIndicator />

      {/* --- STEP 1: SELECT PERIOD --- */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Select Payroll Period</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', {month: 'long'})}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>

          {/* --- RUN TYPE SELECTOR --- */}
          <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Payroll Type</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setRunType('REGULAR')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                            runType === 'REGULAR' 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                        <div className="font-bold">Regular Monthly</div>
                        <div className="text-xs opacity-70 mt-1">Basic Salary + Allowances + Tax</div>
                    </button>

                    <button
                        onClick={() => setRunType('OFF_CYCLE')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                            runType === 'OFF_CYCLE' 
                            ? 'border-amber-500 bg-amber-50 text-amber-800' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                        <div className="font-bold">Off-Cycle / Adhoc</div>
                        <div className="text-xs opacity-70 mt-1">Zero Salary. Manual Bonuses/Exit Dues only.</div>
                    </button>
                </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8">
            <p className="text-sm text-slate-500">Selected Period: <span className="font-bold text-slate-900">{new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</span> ({runType})</p>
          </div>

          <button 
            onClick={() => handleGeneratePayroll(false)}
            disabled={isProcessing}
            className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : 'Generate Payroll'} <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* --- STEP 2: REVIEW --- */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 mb-1">Total Gross Pay</p>
                <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(summary.totalGross)}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 mb-1">Total Employees</p>
                <h3 className="text-3xl font-bold text-slate-900">{summary.totalEmployees}</h3>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Deduction Breakdown</h3>
            </div>
            <div className="p-6 space-y-4">
                {[
                    { label: "PAYE (Income Tax)", val: summary.totalPaye },
                    { label: "SHIF (Health Insurance)", val: summary.totalShif },
                    { label: "Housing Levy (1.5%)", val: summary.totalHousing },
                    { label: "NSSF (Pension)", val: summary.totalNssf },
                ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(item.val)}</span>
                    </div>
                ))}
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-800">Net Pay (Take Home)</span>
                    <span className="font-bold text-emerald-800 text-xl">{formatCurrency(summary.totalNetPay)}</span>
                </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900">Employee List</h3>
                 <div className="relative">
                     <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                     <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:border-emerald-500" />
                 </div>
             </div>
             <div className="overflow-x-auto">
                 {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                    </div>
                 ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold uppercase text-xs">
                            <tr>
                                <th className="p-4">Employee</th>
                                <th className="p-4">Basic Salary</th>
                                <th className="p-4 text-emerald-600">Allowances</th>
                                <th className="p-4 text-red-600">Deductions</th>
                                <th className="p-4">Net Pay</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payrollData.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No data available.</td></tr>
                            ) : payrollData.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-900">{emp.employee}</p>
                                        <p className="text-xs text-slate-500">{emp.department}</p>
                                    </td>
                                    <td className="p-4 font-medium">{formatCurrency(emp.basicSalary)}</td>
                                    <td className="p-4 text-emerald-600 bg-emerald-50/30">{formatCurrency(emp.allowances)}</td>
                                    <td className="p-4 text-red-600 bg-red-50/30">{formatCurrency(emp.deductions)}</td>
                                    <td className="p-4 font-bold text-slate-900">{formatCurrency(emp.netPay)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* ADJUST BUTTON (Disabled if Locked) */}
                                            <button 
                                                onClick={() => handleOpenAdjustment(emp)}
                                                disabled={summary.isLocked}
                                                className={`
                                                  text-xs border px-3 py-1.5 rounded-lg flex items-center gap-1
                                                  ${summary.isLocked 
                                                    ? 'text-slate-400 border-slate-200 cursor-not-allowed bg-slate-50' 
                                                    : 'text-indigo-600 hover:text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100'}
                                                `}
                                                title={summary.isLocked ? "Payroll is locked" : "Add Bonus or Deduction"}
                                            >
                                                {summary.isLocked ? <Lock size={12}/> : <PlusCircle size={14} />} Adjust
                                            </button>

                                            <button 
                                                onClick={() => handleDownloadFile(`/payroll/download-payslip/${emp.id}/`, `Payslip_${emp.employee}.pdf`)}
                                                className="text-emerald-600 hover:text-emerald-700 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1"
                                            >
                                                <FileText size={14} /> View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50"
            >
                Back
            </button>
            
            {/* LOCK PAYROLL BUTTON */}
            {!summary.isLocked && summary.runId && (
                <button 
                    onClick={handleLockPayroll}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2"
                >
                    {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <Lock size={18} />} Lock Payroll
                </button>
            )}

            <button 
                onClick={() => setStep(3)}
                className="flex-auto w-2/3 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2"
            >
                Continue to Disbursement <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: DISBURSE --- */}
      {step === 3 && (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                    <p className="text-sm text-slate-500">Total Net Pay to Disburse</p>
                    <h2 className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.totalNetPay)}</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Recipients</p>
                    <h2 className="text-2xl font-bold text-slate-900">{summary.totalEmployees}</h2>
                </div>
            </div>

            <h3 className="font-bold text-slate-900">Select Disbursement Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={handleMpesaDisbursement}
                    disabled={isProcessing}
                    className="group relative overflow-hidden bg-emerald-500 p-8 rounded-xl text-left transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30"
                >
                    <div className="relative z-10 text-white">
                        <Smartphone size={32} className="mb-4" />
                        <h3 className="text-xl font-bold mb-2">Disburse via M-Pesa</h3>
                        <p className="text-emerald-50 text-sm mb-6">Instant payment to employee M-Pesa numbers (B2C)</p>
                        <div className="inline-flex items-center gap-2 text-xs bg-white/20 px-3 py-1 rounded-full">
                            {summary.totalEmployees} employees will receive via M-Pesa
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                </button>

                <button 
                    onClick={handleMarkAsPaid}
                    disabled={isProcessing}
                    className="group relative overflow-hidden bg-slate-900 p-8 rounded-xl text-left transition-all hover:bg-slate-800 hover:shadow-lg"
                >
                    <div className="relative z-10 text-white">
                        <Building2 size={32} className="mb-4" />
                        <h3 className="text-xl font-bold mb-2">Mark as Paid</h3>
                        <p className="text-slate-400 text-sm mb-6">Manual bank transfer completed separately</p>
                    </div>
                </button>
            </div>

            <button 
                onClick={() => setStep(2)}
                className="w-full py-3 text-slate-500 hover:text-slate-900 font-medium"
            >
                Back to Review
            </button>
        </div>
      )}

      {isAdjustmentModalOpen && adjustmentTarget && (
        <AdjustmentsModal 
          runId={adjustmentTarget.runId} 
          employeeId={adjustmentTarget.employeeId}
          employeeName={adjustmentTarget.name}
          onClose={() => setIsAdjustmentModalOpen(false)}
          onSave={() => {
             fetchPayroll(); 
          }}
        />
      )}

    </div>
  );
};

export default Payroll;