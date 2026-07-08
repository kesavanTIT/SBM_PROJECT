import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, ArrowLeft } from 'lucide-react';

export function CreateStaff({ onAddStaff, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Teacher',
    department: 'Science',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please provide a name and email address.');
      return;
    }

    // Add to global state
    onAddStaff({
      ...formData,
      id: Date.now(),
      status: 'Present', // default active
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onCancel(); // navigate back to view staff
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon-sm"
          onClick={onCancel}
          className="h-8 w-8 text-[#64748b] hover:text-[#1e293b]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight">Create Staff Member</h2>
          <p className="text-xs text-[#64748b]">Register a new staff member profile to include them in attendance logs.</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal-200 p-4 text-teal-800 text-sm font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
            <Check className="h-4 w-4" />
          </div>
          <span>Staff profile registered successfully! Redirecting...</span>
        </div>
      )}

      {/* Form Container */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]" htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]" htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                required
                placeholder="e.g. john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Joining Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]" htmlFor="joinDate">Joining Date</label>
              <input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]" htmlFor="role">Role / Designation</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none transition-all duration-200"
              >
                <option value="Teacher">Teacher</option>
                <option value="Administrator">Administrator</option>
                <option value="Assistant">Assistant</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]" htmlFor="department">Department</label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs text-[#334155] focus:border-teal-500 focus:outline-none transition-all duration-200"
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f1f5f9] mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/10 gap-1.5"
            >
              <UserPlus className="h-4 w-4" /> Save Profile
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
