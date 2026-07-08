import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Users, UserCheck, UserX, Clock, ArrowUpRight, Plus, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chartData = [
  { name: 'Mon', rate: 92 },
  { name: 'Tue', rate: 96 },
  { name: 'Wed', rate: 95 },
  { name: 'Thu', rate: 98 },
  { name: 'Fri', rate: 96 },
  { name: 'Sat', rate: 100 },
  { name: 'Sun', rate: 96 },
];

export function DashboardOverview({ staff = [], onCreateStaffClick }) {
  const totalStaff = staff.length;
  const presentToday = staff.filter(s => s.status === 'Present').length;
  const absentToday = totalStaff - presentToday;
  const attendanceRate = totalStaff > 0 ? Math.round((presentToday / totalStaff) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-[#64748b]">Real-time summaries of SBM staff members and today's attendance logs.</p>
        </div>
        <Button 
          onClick={onCreateStaffClick} 
          className="bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-700/20"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Attendance Rate */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Avg Attendance Rate</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e293b]">{attendanceRate}%</h3>
            <p className="mt-1 flex items-center text-[10px] text-green-600 font-bold">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" /> +1.2% from last week
            </p>
          </div>
        </div>

        {/* Card 2: Total Staff */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Total Staff</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e293b]">{totalStaff}</h3>
            <p className="mt-1 flex items-center text-[10px] text-green-600 font-bold">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" /> +2 members this month
            </p>
          </div>
        </div>

        {/* Card 3: Total Present */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Total Present Today</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e293b]">{presentToday}</h3>
            <p className="mt-1 flex items-center text-[10px] text-emerald-600 font-bold">
              Stable from yesterday
            </p>
          </div>
        </div>

        {/* Card 4: Total Absent */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Total Absent Today</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
              <UserX className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e293b]">{absentToday}</h3>
            <p className="mt-1 flex items-center text-[10px] text-rose-600 font-bold">
              No critical action required
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#1e293b]">Weekly Attendance Trends</h3>
            <p className="text-xs text-[#64748b]">Average percentage of active staff present day-to-day</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#1e293b',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="rate" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" name="Attendance %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Updates Panel */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1e293b]">Recent Activities</h3>
            <Clock className="h-4.5 w-4.5 text-[#64748b]" />
          </div>
          <div className="space-y-4">
            {staff.slice(0, 4).map((member, i) => (
              <div key={member.id} className="flex items-start gap-3 text-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 font-bold">
                  {member.name[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-[#1e293b] truncate">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">
                    Checked in as <span className="text-teal-600 font-semibold">{member.status}</span>
                  </p>
                </div>
                <span className="text-[10px] text-[#94a3b8] whitespace-nowrap">
                  {i * 15 + 5}m ago
                </span>
              </div>
            ))}
            {totalStaff === 0 && (
              <p className="text-center text-xs text-[#64748b] py-8">No recent activities available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
