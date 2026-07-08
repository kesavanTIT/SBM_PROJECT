import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  UserPlus, 
  UserCheck, 
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ activePage, setActivePage, staffCount = 0 }) {
  const [staffOpen, setStaffOpen] = useState(true);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-[#0b0e17] text-[#9ca3af] border-r border-[#1e293b]">
      {/* Brand Header */}
      <div className="flex h-20 items-center gap-3 border-b border-[#1e293b] px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md shadow-teal-900/35">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-white tracking-tight leading-tight">SBM Academy</span>
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mt-0.5">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        
        {/* Dashboard Link */}
        <button
          onClick={() => setActivePage('dashboard')}
          className={cn(
            "flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 outline-none",
            activePage === 'dashboard'
              ? "bg-[#1e293b] text-white shadow-sm"
              : "hover:bg-[#111827] hover:text-white"
          )}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* Staff Collapsible Menu */}
        <div className="space-y-1">
          <button
            onClick={() => setStaffOpen(!staffOpen)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 outline-none hover:bg-[#111827] hover:text-white",
              (activePage === 'create-staff' || activePage === 'view-staff') && "text-white"
            )}
          >
            <div className="flex items-center gap-3.5">
              <Users className="h-5 w-5 shrink-0" />
              <span>Staff</span>
            </div>
            <div className="flex items-center gap-2">
              {staffCount > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-teal-500/10 px-2 text-xs font-semibold text-teal-400">
                  {staffCount}
                </span>
              )}
              {staffOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </button>

          {/* Submenu Items */}
          {staffOpen && (
            <div className="pl-6 space-y-1">
              <button
                onClick={() => setActivePage('create-staff')}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-200 outline-none",
                  activePage === 'create-staff'
                    ? "text-white bg-[#1e293b]/40 font-semibold"
                    : "hover:text-white text-gray-400"
                )}
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                <span>Create Staff</span>
              </button>

              <button
                onClick={() => setActivePage('view-staff')}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-200 outline-none",
                  activePage === 'view-staff'
                    ? "text-white bg-[#1e293b]/40 font-semibold"
                    : "hover:text-white text-gray-400"
                )}
              >
                <UserCheck className="h-4 w-4 shrink-0" />
                <span>View Staff</span>
              </button>
            </div>
          )}
        </div>

        {/* Staff Attendance Link */}
        <button
          onClick={() => setActivePage('staff-attendance')}
          className={cn(
            "flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 outline-none",
            activePage === 'staff-attendance'
              ? "bg-[#1e293b] text-white shadow-sm"
              : "hover:bg-[#111827] hover:text-white"
          )}
        >
          <CalendarCheck className="h-5 w-5 shrink-0" />
          <span>Staff Attendance</span>
        </button>

      </nav>

      {/* Logout Button Fixed Bottom */}
      <div className="border-t border-[#1e293b] p-4">
        <button
          onClick={() => alert('Logged out successfully!')}
          className="flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 outline-none text-[#ef4444] hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
