import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Trash2, UserX, UserCheck, Mail, Phone, MapPin 
} from 'lucide-react';
import Header from '../layout/Header';
import AddEmployeeModal from '../dashboard/AddEmployeeModal';
import api from '../../api/axios';

// Interface matching your Backend API
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  role: string;
  department: string;
  is_active: boolean; // True = Active, False = On Leave/Inactive
  created_at: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // Track which menu is open
  const [showAddModal, setShowAddModal] = useState(false); // Modal State

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- ACTIONS ---

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee? This cannot be undone.")) return;

    try {
      await api.delete(`/employees/${id}/`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setOpenMenuId(null);
    } catch (error) {
      // FIX 1: Log the error to satisfy ESLint
      console.error("Delete failed:", error); 
      alert("Failed to delete employee.");
    }
  };

  const handleToggleStatus = async (employee: Employee) => {
    const newStatus = !employee.is_active;
    try {
      // Sending partial update (PATCH)
      await api.patch(`/employees/${employee.id}/`, { is_active: newStatus });
      
      // Update UI optimistically
      setEmployees(prev => prev.map(emp => 
        emp.id === employee.id ? { ...emp, is_active: newStatus } : emp
      ));
      setOpenMenuId(null);
    } catch (error) {
      // FIX 2: Log the error to satisfy ESLint
      console.error("Status update failed:", error);
      alert("Failed to update status.");
    }
  };

  // Stats Logic
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.is_active).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
             fetchEmployees(); 
             alert("Employee added successfully!");
          }}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Header 
          title="Employees" 
          subtitle="Manage your team members and their account details"
          user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
        />
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">
             <Filter size={18} /> Export CSV
           </button>
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium shadow-lg shadow-slate-900/20 transition-all active:scale-95"
           >
             <Plus size={18} /> Add Employee
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
           <div>
              <p className="text-sm text-slate-500 font-medium">Total Employees</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalEmployees}</h3>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck size={24} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
           <div>
              <p className="text-sm text-slate-500 font-medium">Active Now</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{activeEmployees}</h3>
           </div>
           <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
           <div>
              <p className="text-sm text-slate-500 font-medium">Inactive / On Leave</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{inactiveEmployees}</h3>
           </div>
           <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, role, or email..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white" 
              />
           </div>
           <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              <Filter size={16} /> All Status
           </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-5">Employee</th>
                <th className="p-5">Contact Info</th>
                <th className="p-5">Role & Dept</th>
                <th className="p-5">Status</th>
                <th className="p-5">Joined</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                 <tr><td colSpan={6} className="p-10 text-center text-slate-500">Loading employees...</td></tr>
              ) : employees.length === 0 ? (
                 <tr><td colSpan={6} className="p-10 text-center text-slate-500">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.first_name} {emp.last_name}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                             <MapPin size={10} /> Nairobi
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                           <Mail size={12} className="text-slate-400" /> {emp.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                           <Phone size={12} className="text-slate-400" /> {emp.phone_number || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-medium text-slate-900">{emp.role}</p>
                      <p className="text-xs text-slate-500">{emp.department}</p>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        emp.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {emp.is_active ? 'Active' : 'On Leave'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500">
                       {new Date(emp.created_at).toLocaleDateString()}
                    </td>
                    
                    {/* ACTION MENU */}
                    <td className="p-5 text-right relative">
                      <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           setOpenMenuId(openMenuId === emp.id ? null : emp.id);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === emp.id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-10 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        >
                          <div className="py-1">
                            <button 
                              onClick={() => handleToggleStatus(emp)}
                              className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                            >
                              {emp.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                              {emp.is_active ? 'Mark On Leave' : 'Activate Employee'}
                            </button>
                            <button 
                              onClick={() => handleDelete(emp.id)}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
                            >
                              <Trash2 size={16} /> Delete Employee
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;