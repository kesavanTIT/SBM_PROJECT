import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

export function Header({ title, subtitle, searchValue, onSearchChange, onMenuToggle }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#e2e8f0] bg-white px-4 md:px-8">
      {/* Dynamic Title and Date */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-[#1e293b] tracking-tight truncate max-w-[200px] md:max-w-none">{title}</h1>
          <p className="text-[10px] md:text-xs font-medium text-[#64748b] mt-0.5 truncate max-w-[200px] md:max-w-none">{subtitle || currentDate}</p>
        </div>
      </div>

      {/* Right Section Tools */}
      <div className="flex items-center gap-6">
        
        {/* Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute top-3 left-4 h-4.5 w-4.5 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search records, staff, or IDs..."
            value={searchValue || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full rounded-full border border-[#cbd5e1] bg-white py-2.5 pr-4 pl-11 text-xs text-[#334155] placeholder:text-[#94a3b8] focus:border-teal-500 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Notifications Icon */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#64748b] hover:text-[#1e293b] transition-all duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Admin Profile Widget */}
        <div className="flex items-center gap-3 border-l border-[#e2e8f0] pl-6">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
            alt="Admin Profile"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/20"
          />
          <div className="hidden flex-col md:flex">
            <span className="text-xs font-bold text-[#1e293b]">Administrator</span>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">Admin</span>
          </div>
          <ChevronDown className="h-4 w-4 text-[#64748b] hidden md:block" />
        </div>

      </div>
    </header>
  );
}
