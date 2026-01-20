import { useState } from 'react';
import Header from '../layout/Header';
import { 
  Search, Plus, Filter, MoreHorizontal, 
  Mail, Phone, MapPin, Download 
} from 'lucide-react';

// 1. Employee Interface
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
  avatar: string; 
}

// 2. Mock Data
const initialEmployees: Employee[] = [
  { id: 1, name: 'John Kamau', role: 'Senior Developer', department: 'Engineering', email: 'john.k@sheriaflow.co.ke', phone: '+254 712 345 678', location: 'Nairobi', status: 'Active', joinDate: 'Jan 10, 2024', avatar: 'JK' },
  { id: 2, name: 'Sarah Wanjiku', role: 'Legal Counsel', department: 'Legal', email: 'sarah.w@sheriaflow.co.ke', phone: '+254 722 123 456', location: 'Nairobi', status: 'Active', joinDate: 'Feb 15, 2024', avatar: 'SW' },
  { id: 3, name: 'Michael Omondi', role: 'HR Manager', department: 'HR', email: 'michael.o@sheriaflow.co.ke', phone: '+254 733 987 654', location: 'Remote', status: 'On Leave', joinDate: 'Mar 01, 2023', avatar: 'MO' },
  { id: 4, name: 'Lucy Achieng', role: 'Accountant', department: 'Finance', email: 'lucy.a@sheriaflow.co.ke', phone: '+254 711 222 333', location: 'Mombasa', status: 'Active', joinDate: 'Jan 05, 2025', avatar: 'LA' },
  { id: 5, name: 'Brian Koech', role: 'Sales Rep', department: 'Sales', email: 'brian.k@sheriaflow.co.ke', phone: '+254 755 444 555', location: 'Kisumu', status: 'Terminated', joinDate: 'Dec 12, 2023', avatar: 'BK' },
  { id: 6, name: 'Grace Njoroge', role: 'UI/UX Designer', department: 'Engineering', email: 'grace.n@sheriaflow.co.ke', phone: '+254 700 111 222', location: 'Nairobi', status: 'Active', joinDate: 'Jul 20, 2024', avatar: 'GN' },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter Logic
  const filteredEmployees = initialEmployees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Header 
          title="Employees" 
          subtitle="Manage your team members and their account details"
          user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
        />
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             <Download size={18} />
             Export CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-lg shadow-slate-900/20">
             <Plus size={18} />
             Add Employee
           </button>
        </div>
      </div>

      {/* 2. Stats Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Total Employees</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">{initialEmployees.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
               <Search size={24} /> {/* Icon placeholder */}
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Active Now</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">
                 {initialEmployees.filter(e => e.status === 'Active').length}
               </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
               <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-100" />
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">On Leave</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">
                 {initialEmployees.filter(e => e.status === 'On Leave').length}
               </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
               <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-amber-100" />
            </div>
         </div>
      </div>

      {/* 3. Main Content Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, role, or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
             <Filter size={18} className="text-slate-400" />
             <select 
               className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="All">All Status</option>
               <option value="Active">Active</option>
               <option value="On Leave">On Leave</option>
               <option value="Terminated">Terminated</option>
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-900 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
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
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Name */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {employee.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{employee.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                           <MapPin size={12} /> {employee.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="p-5">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-xs">
                          <Mail size={14} className="text-slate-400" /> {employee.email}
                       </div>
                       <div className="flex items-center gap-2 text-xs">
                          <Phone size={14} className="text-slate-400" /> {employee.phone}
                       </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-5">
                    <p className="font-medium text-slate-900">{employee.role}</p>
                    <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {employee.department}
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      employee.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : employee.status === 'On Leave' 
                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        employee.status === 'Active' ? 'bg-emerald-500' :
                        employee.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {employee.status}
                    </span>
                  </td>

                  {/* Join Date */}
                  <td className="p-5 text-slate-500 font-medium">
                    {employee.joinDate}
                  </td>

                  {/* Actions */}
                  <td className="p-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Search size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No employees found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
              <button 
                 onClick={() => {setSearchTerm(''); setStatusFilter('All')}}
                 className="mt-4 text-emerald-600 font-medium hover:underline"
              >
                 Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;