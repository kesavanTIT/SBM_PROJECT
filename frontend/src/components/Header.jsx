import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

export function Header({ title, subtitle, searchValue, onSearchChange, onMenuToggle }) {
  const [profileImg, setProfileImg] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80");

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setProfileImg(imgUrl);
    }
  };

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



        {/* Admin Profile Widget */}
        <div className="flex items-center gap-3 border-l border-[#e2e8f0] pl-6 relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
          <div className="relative">
            <img
              src={profileImg}
              alt="Admin Profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/20 group-hover:ring-teal-500 transition-all"
            />
            {/* Hover overlay for 'Add Photo' */}
            <div className="absolute inset-0 bg-black/40 rounded-full hidden group-hover:flex items-center justify-center">
              <span className="text-[8px] font-bold text-white uppercase text-center leading-tight">Change<br/>Photo</span>
            </div>
          </div>
          <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
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
