import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Mail, Key, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StaffLogin({ onLogin, onSwitchToAdmin }) {
  const [email, setEmail] = useState('');
  const [staffId, setStaffId] = useState('');
  const [showId, setShowId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/staff-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, staffId }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('sbm_token', data.token);
        localStorage.setItem('sbm_role', 'staff');
        onLogin(data.data.staff);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] shadow-lg flex items-center justify-center">
              <span className="text-white font-black text-xl tracking-tighter">SBM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#0f172a] leading-none tracking-tight">SBM</span>
              <span className="text-[10px] font-bold text-[#3b82f6] tracking-[0.2em] leading-none mt-1">STAFF PORTAL</span>
            </div>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-black text-[#0f172a] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-[#64748b]">
          Please sign in to your staff account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl border border-[#f1f5f9]">

          {/* Login Type Tabs */}
          <div className="flex bg-[#f1f5f9] p-1 rounded-xl mb-8 border border-[#e2e8f0]">
            <button 
              type="button" 
              onClick={onSwitchToAdmin} 
              className="flex-1 py-2 text-xs font-bold text-[#64748b] hover:text-[#475569] transition-colors"
            >
              Admin
            </button>
            <button className="flex-1 py-2 text-xs font-bold bg-white text-[#0f172a] rounded-lg shadow-sm">
              Staff
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-[#fef2f2] border border-[#fca5a5] text-[#ef4444] px-4 py-3 rounded-xl text-sm font-bold flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mr-2"></div>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#94a3b8]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-[15px] font-semibold text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all bg-[#f8fafc] focus:bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">
                Staff ID (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-[#94a3b8]" />
                </div>
                <input
                  type={showId ? "text" : "password"}
                  required
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 border border-[#e2e8f0] rounded-xl text-[15px] font-semibold text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all bg-[#f8fafc] focus:bg-white"
                  placeholder="e.g. SBM061"
                />
                <button
                  type="button"
                  onClick={() => setShowId(!showId)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94a3b8] hover:text-[#64748b] transition-colors"
                >
                  {showId ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-6 px-4 border border-transparent rounded-xl shadow-lg shadow-[#3b82f6]/20 text-[15px] font-bold text-white bg-[#1d4ed8] hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Signing in...
                </>
              ) : (
                'Sign in to Dashboard'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
