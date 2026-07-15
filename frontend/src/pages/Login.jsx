import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Fingerprint, ArrowRight, Terminal, Server, Cpu } from 'lucide-react';
import { Logo } from '../components/Logo';
import API_BASE_URL from '../config';

export function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Try Admin Login first
      const adminResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const adminData = await adminResponse.json();

      if (adminResponse.ok && adminData.status === 'success') {
        localStorage.setItem('sbm_token', adminData.token);
        localStorage.setItem('sbm_role', 'admin');
        onLoginSuccess('admin', adminData.data.admin);
        return;
      }

      // 2. If Admin Login fails, try Staff Login with password as staffId
      const staffResponse = await fetch(`${API_BASE_URL}/api/v1/auth/staff-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, staffId: password }),
      });

      const staffData = await staffResponse.json();

      if (staffResponse.ok && staffData.status === 'success') {
        localStorage.setItem('sbm_token', staffData.token);
        localStorage.setItem('sbm_role', 'staff');
        onLoginSuccess('staff', staffData.data.staff);
        return;
      }

      // If both logins fail, display a clean error message
      setError('Access Denied. Check your credentials.');
    } catch (err) {
      console.error(err);
      setError('Connection failure. Server offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background texture pattern similar to card */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #e2e8f0 1px, #e2e8f0 2px)', backgroundSize: '100% 4px' }}></div>
      
      <div className="w-full max-w-[400px] bg-white border border-[#e2e8f0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden relative z-10 flex flex-col transition-all duration-300">
        
        {/* Top green accent bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#0c7040]"></div>

        <div className="p-6 pb-8">
          
          {/* Branding Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <img src="/polywood.jpg.png" alt="Polywood Since 1992" className="w-48 mb-2 object-contain" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold p-3 rounded-lg flex items-center justify-center shadow-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#0c7040] focus:ring-1 focus:ring-[#0c7040] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password / Staff ID"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-[#0c7040] focus:ring-1 focus:ring-[#0c7040] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#0c7040] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="h-2"></div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0c7040] hover:bg-[#095932] text-white font-bold text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
