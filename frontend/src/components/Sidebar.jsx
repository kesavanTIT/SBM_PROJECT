import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  UserPlus, 
  UserCheck,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

export function Sidebar({ activePage, setActivePage, staffCount = 0, isCollapsed, onToggleCollapse, onLogout, isMobileOpen, onMobileClose }) {
  const [staffOpen, setStaffOpen] = useState(true);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0b0e17] text-[#9ca3af] border-r border-[#1e293b] transition-transform duration-300 ease-in-out",
          isCollapsed ? "md:w-20" : "w-64 md:w-56",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      {/* Brand Header */}
      <div 
        className={cn(
          "flex h-20 items-center border-b border-[#1e293b] transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Logo className={cn("h-11 w-auto shrink-0 transition-all", isCollapsed ? "h-10 mx-auto" : "")} />
          {!isCollapsed && (
            <div className="flex flex-col animate-fadeIn">
              <span className="text-sm font-extrabold text-white tracking-tight leading-tight">SBM</span>
              <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mt-0.5">Admin Portal</span>
            </div>
          )}
        </div>

        {/* Collapsible toggle arrow button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded-md hover:bg-[#1e293b] text-[#64748b] transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#1e293b] text-[#64748b] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
        
        {/* Dashboard Link */}
        <button
          onClick={() => setActivePage('dashboard')}
          className={cn(
            "flex w-full items-center rounded-lg py-2 text-sm font-medium transition-all duration-200 outline-none",
            isCollapsed ? "justify-center px-0" : "px-4 gap-3.5",
            activePage === 'dashboard'
              ? "bg-[#1e293b] text-white shadow-sm"
              : "hover:bg-[#111827] hover:text-white"
          )}
          title={isCollapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="animate-fadeIn">Dashboard</span>}
        </button>

        {/* Staff Collapsible Menu */}
        <div className="space-y-1">
          <button
            onClick={() => {
              if (isCollapsed) {
                // If collapsed, expand first so user can see submenu
                onToggleCollapse();
                setStaffOpen(true);
              } else {
                setStaffOpen(!staffOpen);
              }
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg py-2 text-sm font-medium transition-all duration-200 outline-none hover:bg-[#111827] hover:text-white",
              isCollapsed ? "justify-center px-0" : "px-4",
              (activePage === 'create-staff' || activePage === 'view-staff') && "text-white"
            )}
            title={isCollapsed ? "Staff Management" : undefined}
          >
            <div className="flex items-center gap-3.5">
              <Users className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="animate-fadeIn">Staff</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-2 animate-fadeIn">
                {staffCount > 0 && (
                  <span className="flex h-5 items-center justify-center rounded-full bg-teal-500/10 px-2 text-xs font-semibold text-teal-400">
                    {staffCount}
                  </span>
                )}
                {staffOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            )}
          </button>

          {/* Submenu Items */}
          {staffOpen && !isCollapsed && (
            <div className="pl-6 space-y-1 animate-slideDown">
              <button
                onClick={() => setActivePage('create-staff')}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-200 outline-none",
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
                  "flex w-full items-center gap-3 rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-200 outline-none",
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
            "flex w-full items-center rounded-lg py-2 text-sm font-medium transition-all duration-200 outline-none",
            isCollapsed ? "justify-center px-0" : "px-4 gap-3.5",
            activePage === 'staff-attendance'
              ? "bg-[#1e293b] text-white shadow-sm"
              : "hover:bg-[#111827] hover:text-white"
          )}
          title={isCollapsed ? "Staff Attendance" : undefined}
        >
          <CalendarCheck className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="animate-fadeIn">Staff Attendance</span>}
        </button>

      </nav>

      {/* Logout Button Fixed Bottom */}
      <div className="border-t border-[#1e293b] p-4">
        <button
          onClick={onLogout}
          className={cn(
            "flex w-full items-center rounded-lg py-2 text-sm font-medium transition-all duration-200 outline-none text-[#ef4444] hover:bg-red-500/10 hover:text-red-400",
            isCollapsed ? "justify-center px-0" : "px-4 gap-3.5"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="animate-fadeIn">Logout</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
