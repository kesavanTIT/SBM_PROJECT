import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { Users, GraduationCap, ClipboardCheck, Award } from 'lucide-react';

const revenueData = [
  { month: 'Jan', rate: 85 },
  { month: 'Feb', rate: 88 },
  { month: 'Mar', rate: 90 },
  { month: 'Apr', rate: 94 },
  { month: 'May', rate: 96 },
  { month: 'Jun', rate: 98 },
  { month: 'Jul', rate: 100 },
];

const weeklyData = [
  { name: 'Mon', rate: 95 },
  { name: 'Tue', rate: 96 },
  { name: 'Wed', rate: 98 },
  { name: 'Thu', rate: 100 },
  { name: 'Fri', rate: 95 },
  { name: 'Sat', rate: 90 },
  { name: 'Sun', rate: 92 },
];

export function DashboardOverview({ staff = [] }) {
  const totalStaff = staff.length;
  const presentToday = staff.filter(s => s.status === 'Present').length;
  const attendanceRate = totalStaff > 0 ? Math.round((presentToday / totalStaff) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Banner matching reference UI exactly */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1e293b] p-8 text-white shadow-sm">
        {/* Abstract graduation cap icon background watermark on the right */}
        <div className="absolute right-10 bottom-[-20px] opacity-10 pointer-events-none">
          <GraduationCap className="h-44 w-44" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to SBM Portal</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Monitor and manage staff records, daily session attendances, department performances, and academic schedules in real time.
          </p>
        </div>
      </div>

      {/* 2. Grid of Cards matching reference stats layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Total Staff */}
        <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Total Staff</span>
            <h3 className="text-3xl font-extrabold text-[#1e293b]">{totalStaff}</h3>
            <p className="text-[10px] text-gray-400 font-medium">Active Profiles</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0091ff]/10 text-[#0091ff]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Attendance Rate</span>
            <h3 className="text-3xl font-extrabold text-[#1e293b]">{attendanceRate}%</h3>
            <p className="text-[10px] text-gray-400 font-medium">Present Today</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <ClipboardCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Active Departments */}
        <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Active Departments</span>
            <h3 className="text-3xl font-extrabold text-[#1e293b]">5</h3>
            <p className="text-[10px] text-gray-400 font-medium">Science, Maths, English, IT, Admin</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Charts Grid matching reference monthly/weekly trends */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1e293b]">Monthly Attendance Trend</h3>
              <p className="text-[10px] text-[#64748b]">Daily session check-in averages by month</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
              ↗ +18.4% growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" name="Attendance Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bar Chart */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#1e293b]">Weekly Attendance</h3>
            <p className="text-[10px] text-[#64748b]">Average attendance rate percentage (%)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
                <Bar dataKey="rate" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Attendance Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
