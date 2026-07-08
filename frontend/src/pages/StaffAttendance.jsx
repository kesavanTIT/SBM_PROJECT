import React, { useState } from 'react';
import { ClipboardCheck, Download, Printer, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StaffAttendance({ staff = [], onToggleAttendance }) {
  const [viewBy, setViewBy] = useState('Daily');
  const [selectedMonth, setSelectedMonth] = useState('July 2026');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  const totalStaff = staff.length;
  const presentCount = staff.filter(s => s.status === 'Present').length;
  const absentCount = totalStaff - presentCount;
  const avgAttendance = totalStaff > 0 ? Math.round((presentCount / totalStaff) * 100) : 0;

  // Filter staff for attendance list
  const filteredStaff = staff.filter(member => {
    if (deptFilter === 'All Departments') return true;
    return member.department === deptFilter;
  });

  return (
    <div className="space-y-6">
      {/* Report Panel Wrapper */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        
        {/* Header and Views */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b] tracking-tight">Staff Attendance Log</h2>
              <p className="text-[10px] text-[#64748b]">Manage and record attendance logs for all departments.</p>
            </div>
          </div>

          {/* View By Buttons */}
          <div className="flex items-center gap-1 rounded-xl bg-[#f1f5f9] p-1 text-xs">
            {['Daily', 'Monthly', 'Custom Range'].map((tab) => (
              <button
                key={tab}
                onClick={() => setViewBy(tab)}
                className={`rounded-lg px-4 py-1.5 font-bold transition-all ${
                  viewBy === tab
                    ? 'bg-white text-[#1e293b] shadow-sm'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Month selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Select Date / Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none"
            >
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
              <option value="May 2026">May 2026</option>
            </select>
          </div>

          {/* Department selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Department</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        </div>

      </div>

      {/* Action and Download buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <span className="text-xs font-semibold text-[#64748b]">Showing {filteredStaff.length} records</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Printer className="h-4 w-4" /> Print Summary
          </Button>
        </div>
      </div>

      {/* Interactive Marking List */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#e2e8f0]">
              <tr>
                <th className="p-4 pl-6">Staff Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 pr-6 text-right">Toggle Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-[#f8fafc]/50">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 font-extrabold text-xs">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="font-bold text-[#1e293b]">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#64748b]">{member.role}</td>
                  <td className="p-4 text-[#64748b]">{member.department}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      member.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {member.status === 'Present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="inline-flex rounded-lg border border-[#e2e8f0] p-0.5 bg-[#f8fafc]">
                      <button
                        onClick={() => onToggleAttendance(member.id, 'Present')}
                        className={`rounded-md p-1.5 transition-all ${
                          member.status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-[#64748b] hover:text-[#1e293b]'
                        }`}
                        title="Mark Present"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onToggleAttendance(member.id, 'Absent')}
                        className={`rounded-md p-1.5 transition-all ${
                          member.status === 'Absent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'text-[#64748b] hover:text-[#1e293b]'
                        }`}
                        title="Mark Absent"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm font-semibold text-[#64748b]">
                    No staff records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats Grid at bottom (colored panels matching reference UI) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Rate */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Avg Attendance Rate</span>
          <h3 className="mt-3 text-3xl font-extrabold text-rose-950">{avgAttendance}%</h3>
        </div>

        {/* Total Students/Staff */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Total Staff</span>
          <h3 className="mt-3 text-3xl font-extrabold text-blue-950">{totalStaff}</h3>
        </div>

        {/* Total Present */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Present</span>
          <h3 className="mt-3 text-3xl font-extrabold text-emerald-950">{presentCount}</h3>
        </div>

        {/* Total Absent */}
        <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">Total Absent</span>
          <h3 className="mt-3 text-3xl font-extrabold text-pink-950">{absentCount}</h3>
        </div>
      </div>

    </div>
  );
}
