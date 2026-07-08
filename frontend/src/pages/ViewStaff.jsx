import React, { useState } from 'react';
import { Search, Trash2, Filter, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ViewStaff({ staff = [], onDeleteStaff, onCreateStaffClick, searchQuery = '' }) {
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Filter staff array based on search query, role filter, and department filter
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery));
      
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    const matchesDept = deptFilter === 'All' || member.department === deptFilter;

    return matchesSearch && matchesRole && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight">Staff Profiles</h2>
          <p className="text-xs text-[#64748b]">View, search, and manage registered SBM Academy staff members.</p>
        </div>
        <Button 
          onClick={onCreateStaffClick} 
          className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/20"
        >
          Add Staff Member
        </Button>
      </div>

      {/* Filter and Settings Bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        
        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748b]">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs text-[#334155] focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Teacher">Teacher</option>
            <option value="Administrator">Administrator</option>
            <option value="Assistant">Assistant</option>
            <option value="Coordinator">Coordinator</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748b]">Dept:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs text-[#334155] focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Administration">Administration</option>
          </select>
        </div>

        {/* Reset Filters button */}
        {(roleFilter !== 'All' || deptFilter !== 'All') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRoleFilter('All');
              setDeptFilter('All');
            }}
            className="text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          >
            Reset Filters
          </Button>
        )}

      </div>

      {/* Staff Table Grid */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#e2e8f0]">
              <tr>
                <th className="p-4 pl-6">Staff Member</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Department</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-[#f8fafc]/50">
                  {/* Name Card */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 font-extrabold text-xs">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1e293b]">{member.name}</span>
                        <span className="text-[10px] text-[#94a3b8]">ID: #{member.id.toString().slice(-5)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-[#64748b]">
                        <Mail className="h-3.5 w-3.5 text-[#94a3b8]" /> {member.email}
                      </span>
                      {member.phone && (
                        <span className="flex items-center gap-1 text-[#64748b]">
                          <Phone className="h-3.5 w-3.5 text-[#94a3b8]" /> {member.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4 font-semibold text-[#1e293b]">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-teal-600" /> {member.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="p-4 text-[#64748b]">{member.department}</td>

                  {/* Join Date */}
                  <td className="p-4 text-[#64748b]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#94a3b8]" /> {member.joinDate}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      member.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {member.status === 'Present' ? 'Active' : 'Absent'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 pr-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteStaff(member.id)}
                      className="h-8 w-8 text-[#94a3b8] hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Staff member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-semibold text-[#64748b]">
                    No staff members match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
