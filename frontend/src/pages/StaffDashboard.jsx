import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { Clock, MapPin, CheckCircle2, XCircle, LogOut, User, BookOpen, GraduationCap, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StaffDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#f1f5f9] px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#0f172a] shadow-sm flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-tighter">SBM</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-[#0f172a] leading-none tracking-tight">Staff Portal</h1>
            <p className="text-[10px] font-bold text-[#059669] tracking-wider uppercase mt-1">STAFF DASHBOARD</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="" className="h-10 w-10 rounded-xl object-cover border border-[#e2e8f0]" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center border border-[#e2e8f0]">
                <User className="h-5 w-5 text-[#64748b]" />
              </div>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-[#1e293b]">{user?.name}</p>
              <p className="text-[10px] font-medium text-[#64748b]">ID: {user?.staffId}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-[#64748b] hover:text-[#ef4444] flex items-center gap-2 font-bold px-2 transition-colors text-sm"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        
        {/* Banner */}
        <div className="bg-[#1e293b] rounded-2xl p-8 mb-6 relative overflow-hidden shadow-md">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <GraduationCap className="w-64 h-64 text-white" strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-teal-400 tracking-widest uppercase mb-2">Welcome Back</p>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Hello, {user?.name}!</h2>
            <p className="text-[#94a3b8] text-sm max-w-xl leading-relaxed font-medium">
              Track your staff profile details, view your attendance records, and manage your daily clock-ins from your staff portal.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-[#e2e8f0] mb-8 px-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'profile' ? 'text-[#059669]' : 'text-[#64748b] hover:text-[#1e293b]'}`}
          >
            <User className="h-4 w-4" /> My Profile
            {activeTab === 'profile' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#059669]"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'attendance' ? 'text-[#059669]' : 'text-[#64748b] hover:text-[#1e293b]'}`}
          >
            <Clock className="h-4 w-4" /> Attendance Log
            {activeTab === 'attendance' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#059669]"></div>}
          </button>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'attendance' && <AttendanceTracker staffId={user?.staffId} />}
          {activeTab === 'profile' && <MyProfile user={user} />}
        </div>
        
      </main>
    </div>
  );
}

function MyProfile({ user }) {
  if (!user) return null;
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f1f5f9]">
      
      {/* Profile Header */}
      <div className="flex items-center gap-5 mb-10 pb-6 border-b border-[#f1f5f9]">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt="" className="h-20 w-20 rounded-2xl object-cover border-4 border-[#f8fafc] shadow-sm" />
        ) : (
          <div className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-[#f1f5f9] border-4 border-[#f8fafc] shadow-sm flex items-center justify-center">
            <User className="h-8 w-8 text-[#94a3b8]" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">{user.name}</h2>
          <p className="text-xs font-bold text-[#64748b]">
            Staff ID: {user.staffId} • Registered
          </p>
        </div>
      </div>

      {/* Details Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Personal & Address Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-[#059669] pl-2 mb-6">
            <h3 className="text-xs font-black text-[#059669] tracking-widest uppercase">Personal Details</h3>
          </div>
          
          <div className="bg-[#f8fafc] rounded-2xl p-6 space-y-5 border border-[#f1f5f9]">
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Full Name</p>
              <p className="text-sm font-bold text-[#1e293b]">{user.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Street Address</p>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1e293b]">
                {user.address || 'N/A'}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">City & State</p>
              <p className="text-sm font-bold text-[#1e293b]">
                {user.city ? `${user.city}, ${user.state} ${user.zipCode}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Work Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-[#059669] pl-2 mb-6">
            <h3 className="text-xs font-black text-[#059669] tracking-widest uppercase">Work Details</h3>
          </div>
          
          <div className="bg-[#f8fafc] rounded-2xl p-6 space-y-5 border border-[#f1f5f9]">
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Staff ID</p>
              <p className="text-sm font-bold text-[#1e293b]">{user.staffId}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Date Joined</p>
              <p className="text-sm font-bold text-[#1e293b]">
                {user.joinDate || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Current Status</p>
              <p className="text-sm font-bold text-[#1e293b]">{user.status || 'Active'}</p>
            </div>
          </div>
        </div>

        {/* Column 3: Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-[#059669] pl-2 mb-6">
            <h3 className="text-xs font-black text-[#059669] tracking-widest uppercase">Contact Details</h3>
          </div>
          
          <div className="bg-[#f8fafc] rounded-2xl p-6 space-y-5 border border-[#f1f5f9]">
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Email Address</p>
              <p className="text-sm font-bold text-[#1e293b] break-all">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">Phone Number</p>
              <p className="text-sm font-bold text-[#1e293b]">{user.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] mb-0.5">WhatsApp Number</p>
              <p className="text-sm font-bold text-[#1e293b]">{user.whatsappNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function AttendanceTracker({ staffId }) {
  const [status, setStatus] = useState(null); // 'loading', 'not_checked_in', 'checked_in', 'completed', 'error'
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update live clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem('sbm_token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/v1/attendance/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        const att = data.data.attendance;
        if (!att) {
          setStatus('not_checked_in');
        } else if (att.checkOut) {
          setStatus('completed');
          setRecord(att);
        } else {
          setStatus('checked_in');
          setRecord(att);
        }
      } else {
        setError(data.message || 'Failed to load attendance data');
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
      setStatus('error');
    }
  };

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      }
    });
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const pos = await getPosition();
      const { latitude, longitude } = pos.coords;

      const token = localStorage.getItem('sbm_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/attendance/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ latitude, longitude })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Check-in failed');
      } else {
        fetchTodayStatus();
      }
    } catch (err) {
      setError(err.message || 'Failed to get location. Please allow location access.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('sbm_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/attendance/check-out`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Check-out failed');
      } else {
        fetchTodayStatus();
      }
    } catch (err) {
      setError('Network error during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f1f5f9] max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-sm font-bold text-[#64748b] mb-2 tracking-widest uppercase">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-6xl font-black text-[#0f172a] tracking-tight">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h2>
      </div>

      {error && (
        <div className="mb-6 bg-[#fef2f2] border border-[#fca5a5] text-[#ef4444] px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center shadow-sm">
          <MapPin className="h-4 w-4 mr-2 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {status === 'error' && (
          <div className="w-full text-center py-4">
            <Button onClick={fetchTodayStatus} variant="outline" className="border-[#cbd5e1] text-[#64748b] hover:bg-[#f8fafc]">
              Retry Connection
            </Button>
          </div>
        )}

        {status === 'not_checked_in' && (
          <div className="w-full">
            {currentTime.getDay() === 0 ? (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-8 text-center shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-[#059669]" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#065f46]">Today is Sunday</h3>
                <p className="text-sm font-bold text-[#166534] mt-1">It's a Weekly Off! Enjoy your holiday.</p>
              </div>
            ) : (
              <>
                <Button 
                  onClick={handleCheckIn} 
                  disabled={isLoading}
                  className="w-full h-16 text-lg font-bold rounded-2xl bg-[#059669] hover:bg-[#047857] text-white shadow-xl shadow-[#059669]/20 transition-all"
                >
                  {isLoading ? 'Checking Location...' : 'Clock In for Today'}
                </Button>
                <p className="text-xs text-center text-[#94a3b8] mt-4 font-bold flex items-center justify-center gap-1">
                   <MapPin className="h-3 w-3" /> You must be within office premises to clock in.
                </p>
              </>
            )}
          </div>
        )}

        {status === 'checked_in' && (
          <div className="w-full flex flex-col gap-6">
            <div className="bg-[#f8fafc] rounded-2xl p-6 border border-[#f1f5f9] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Checked In At</p>
                <p className="text-2xl font-black text-[#0f172a]">{formatTime(record.checkIn)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#dcfce7] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="h-6 w-6 text-[#059669]" />
              </div>
            </div>
            
            <Button 
              onClick={handleCheckOut} 
              disabled={isLoading}
              className="w-full h-16 text-lg font-bold rounded-2xl bg-[#e11d48] hover:bg-[#be123c] text-white shadow-xl shadow-[#e11d48]/20 transition-all"
            >
              {isLoading ? 'Processing...' : 'Clock Out'}
            </Button>
          </div>
        )}

        {status === 'completed' && (
          <div className="w-full flex flex-col gap-4">
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">
                <CheckCircle2 className="h-12 w-12 text-[#059669]" />
              </div>
              <h3 className="text-xl font-black text-[#065f46]">Completed for Today</h3>
              <p className="text-sm font-bold text-[#166534] mt-1">Great job! See you tomorrow.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#f1f5f9]">
                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Clock In</p>
                <p className="text-lg font-black text-[#0f172a]">{formatTime(record.checkIn)}</p>
              </div>
              <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#f1f5f9]">
                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Clock Out</p>
                <p className="text-lg font-black text-[#0f172a]">{formatTime(record.checkOut)}</p>
              </div>
            </div>
            
            <div className="bg-[#0f172a] rounded-2xl p-6 shadow-md text-center mt-2 relative overflow-hidden flex flex-col items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b] to-[#0f172a] opacity-50"></div>
              <div className="relative z-10 w-full">
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Total Time Worked</p>
                <p className="text-3xl font-black text-white mb-4">{record.totalHours}</p>
                
                {/* Additional Info Cards */}
                <div className="grid grid-cols-2 gap-2 mt-2 border-t border-[#1e293b] pt-4">
                  <div>
                     <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest mb-1">Shift Status</p>
                     <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        record.status?.includes('Late') || record.status?.includes('Early') 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                     }`}>
                       {record.status || 'Completed'}
                     </span>
                  </div>
                  {record.pendingHours && (
                    <div>
                      <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest mb-1">Pending Time</p>
                      <p className="text-xs font-bold text-amber-400">{record.pendingHours}</p>
                    </div>
                  )}
                  {record.overtimeHours && (
                    <div>
                      <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest mb-1">Overtime</p>
                      <p className="text-xs font-bold text-emerald-400">{record.overtimeHours}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
