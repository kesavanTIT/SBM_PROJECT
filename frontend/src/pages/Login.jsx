import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Fingerprint, ArrowRight, Terminal, Server, Cpu } from 'lucide-react';
import { Logo } from '../components/Logo'; 

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
      const adminResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
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
      const staffResponse = await fetch('http://localhost:5000/api/v1/auth/staff-login', {
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
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)] opacity-20 pointer-events-none"></div>

      {/* Cyber ambient glow blobs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

      <div className="w-full max-w-[440px] bg-[#070d19]/80 border border-cyan-500/25 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur-2xl overflow-hidden relative z-10 flex flex-col transition-all duration-300 hover:border-cyan-500/35">
        
        {/* Top scanline neon glowing bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse"></div>

        <div className="p-8 pb-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/30 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-md"></div>
              <Logo className="w-10 h-10 text-cyan-400 relative z-10" />
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-[0.2em] mb-2 pl-[0.2em]">SBM</h1>
            
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] font-mono uppercase">SECURE PORTAL</span>
            </div>
          </div>

          <div className="h-2"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono p-3 rounded-xl flex items-center gap-2 justify-center shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">SYS_EMAIL_ADDRESS</label>
                <span className="text-[9px] font-mono text-cyan-500/60 uppercase">required</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-cyan-500/60 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full bg-[#080f1e]/80 border border-slate-800 text-slate-200 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-[#0c162b] focus:shadow-[0_0_15px_rgba(6,182,212,0.06)] transition-all font-sans"
                />
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-500 scale-y-0 group-focus-within:scale-y-100 transition-transform duration-200"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">SYS_CREDENTIAL_KEY</label>
                <span className="text-[10px] font-bold text-cyan-400 tracking-wider font-mono uppercase">secure</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-cyan-500/60 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-[#080f1e]/80 border border-cyan-500/20 text-slate-200 text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-cyan-500 focus:bg-[#0c162b] focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-500 scale-y-0 group-focus-within:scale-y-100 transition-transform duration-200"></div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="remember"
                className="w-4 h-4 rounded-md border-cyan-500/30 bg-[#080f1e] text-cyan-500 focus:ring-cyan-500/30 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 font-bold font-mono cursor-pointer select-none">
                REMEMBER_SESSION_DATA
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping"></span>
                  <span>DECRYPTING CREDENTIALS...</span>
                </div>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight className="h-4 w-4 stroke-[3px]" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Futuristic Diagnostics Footer Panel */}
        <div className="mt-auto border-t border-cyan-500/15 bg-[#040913]/90 p-5 flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-center text-[8px] font-bold text-slate-500 tracking-wider">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-cyan-500/60" />
              <span>TERMINAL STATUS: ONLINE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[7px] font-bold text-slate-600 tracking-widest border-t border-cyan-500/5 pt-2">
            <div className="flex items-center gap-1">
              <Cpu className="h-2 w-2 text-cyan-500/40" />
              <span>ENC: AES_256_GCM</span>
            </div>
            <div className="text-right">
              <span>EST: 2026_SBM_CORE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
