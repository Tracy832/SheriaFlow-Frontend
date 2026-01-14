// src/components/pages/Employees.tsx
import { useState } from 'react';
import Header from '../layout/Header';

// 1. Define the Employee Interface
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
  avatar: string; // Initials
}

// 2. Dummy Data
const initialEmployees: Employee[] = [
  { id: 1, name: 'John Kamau', role: 'Senior Developer', department: 'Engineering', email: 'john.k@sheriaflow.co.ke', status: 'Active', joinDate: 'Jan 2024', avatar: 'JK' },
  { id: 2, name: 'Sarah Wanjiku', role: 'Legal Counsel', department: 'Legal', email: 'sarah.w@sheriaflow.co.ke', status: 'Active', joinDate: 'Feb 2024', avatar: 'SW' },
  { id: 3, name: 'Michael Omondi', role: 'HR Manager', department: 'HR', email: 'michael.o@sheriaflow.co.ke', status: 'On Leave', joinDate: 'Mar 2023', avatar: 'MO' },
  { id: 4, name: 'Lucy Achieng', role: 'Accountant', department: 'Finance', email: 'lucy.a@sheriaflow.co.ke', status: 'Active', joinDate: 'Jan 2025', avatar: 'LA' },
  { id: 5, name: 'Brian Koech', role: 'Sales Rep', department: 'Sales', email: 'brian.k@sheriaflow.co.ke', status: 'Terminated', joinDate: 'Dec 2023', avatar: 'BK' },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic (Simple search by name or email)
  const filteredEmployees = initialEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Reuse our Header */}
      <Header 
        title="Employees" 
        subtitle="Manage your team members"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* Action Bar: Search & Add Button */}
      <div className="flex justify-between items-center mb-6">
        
        {/* Search Input */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>

        {/* Add Button */}
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <span>+</span> Add Employee
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-50 transition-colors group">
                
                {/* Name & Avatar Column */}
                <td className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                    {employee.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{employee.name}</p>
                    <p className="text-xs text-slate-400">{employee.email}</p>
                  </div>
                </td>

                <td className="p-4">{employee.role}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">
                    {employee.department}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    employee.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    employee.status === 'On Leave' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {employee.status}
                  </span>
                </td>

                <td className="p-4">
                  <button className="text-slate-400 hover:text-emerald-600 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State if search finds nothing */}
        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No employees found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;