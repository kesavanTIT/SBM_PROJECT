import React, { useState } from 'react';
import { Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ViewStaff({ staff = [], onDeleteStaff, onEditStaff, onViewStaff, onCreateStaffClick, searchQuery = '', onSearchChange }) {
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter staff array based on search query and status filter
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.staffId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery));
      
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header matching screenshot layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-[#0f172a] font-bold shadow-sm border-[#e2e8f0] px-6">
            Staff Directory
          </Button>
        </div>
        <Button 
          onClick={onCreateStaffClick} 
          className="bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-md px-6 font-bold rounded-lg"
        >
          + New Registration
        </Button>
      </div>

      {/* Filter and Search Bar matching screenshot */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#f1f5f9] bg-white p-3 shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search staff by ID, name..."
            className="w-full bg-[#f8fafc] border border-transparent text-[#334155] text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:bg-white focus:border-[#cbd5e1] transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 border-l border-[#e2e8f0] pl-4">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-bold text-[#64748b]">Status:</span>
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${statusFilter === 'All' ? 'bg-[#0f172a] text-white' : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('Present')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${statusFilter === 'Present' ? 'bg-[#0f172a] text-white' : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50'}`}
            >
              Present
            </button>
            <button 
              onClick={() => setStatusFilter('Absent')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${statusFilter === 'Absent' ? 'bg-[#0f172a] text-white' : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50'}`}
            >
              Absent
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden border border-[#f1f5f9]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#334155]">
            <thead className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8] border-b border-[#f1f5f9]">
              <tr>
                <th className="p-5 pl-6 font-extrabold">STAFF DETAILS</th>
                <th className="p-5 font-extrabold">CONTACT INFO</th>
                <th className="p-5 font-extrabold">LOCATION</th>
                <th className="p-5 font-extrabold">DATE OF JOIN</th>
                <th className="p-5 font-extrabold">STATUS</th>
                <th className="p-5 pr-6 font-extrabold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-[#f8fafc]/50">
                  
                  {/* Staff Details (Avatar + Name + ID) */}
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-4">
                      {member.photoUrl ? (
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="h-11 w-11 rounded-full object-cover border border-[#e2e8f0] shadow-sm"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748b] font-bold text-sm border border-[#e2e8f0]">
                          {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-extrabold text-[#0f172a] text-[13px]">{member.name}</span>
                        <span className="inline-block bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                          {member.staffId || member.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-[#6366f1] bg-[#eef2ff] px-2 py-0.5 rounded-md inline-block w-fit">
                        {member.phone}
                      </span>
                      <span className="text-[11px] font-medium text-[#64748b]">
                        {member.email}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#334155]">{member.city}</span>
                      <span className="text-[11px] text-[#ef4444] font-bold mt-0.5">{member.state}</span>
                    </div>
                  </td>

                  {/* Join Date */}
                  <td className="p-5">
                    <span className="text-[13px] font-extrabold text-[#334155]">
                      {member.joinDate}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-5">
                    <span className={`inline-flex items-center text-[11px] font-bold ${
                      member.status === 'Present' || member.status === 'Active'
                        ? 'text-[#059669]'
                        : 'text-[#ef4444]'
                    }`}>
                      {member.status === 'Present' ? 'Active' : member.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-5 pr-6">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors shadow-sm"
                        title="View Staff Details"
                        onClick={() => onViewStaff && onViewStaff(member.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-colors shadow-sm"
                        title="Edit Staff"
                        onClick={() => onEditStaff && onEditStaff(member)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors shadow-sm"
                        title="Delete Staff"
                        onClick={() => onDeleteStaff(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-[#64748b]">
                      <span className="font-bold mb-1">No staff records found</span>
                      <span className="text-xs">Try adjusting your search or filters.</span>
                    </div>
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

