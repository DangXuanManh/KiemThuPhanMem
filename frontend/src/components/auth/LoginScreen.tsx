import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, UserCheck, Lock, Mail, AlertTriangle, KeyRound, Sparkles, Dog } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('admin@petcare.com');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | 'customer'>('admin');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'customer') {
      setErrorMessage('❌ Khách hàng không có quyền truy cập vào phần mềm quản lý nội bộ cửa hàng!');
      return;
    }

    const result = login(email, password, selectedRole);
    if (!result.success) {
      setErrorMessage(result.message || 'Mật khẩu hoặc thông tin đăng nhập không chính xác.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      setEmail('admin@petcare.com');
      setPassword('admin123');
      setSelectedRole('admin');
      login('admin@petcare.com', 'admin123', 'admin');
    } else {
      setEmail('staff@petcare.com');
      setPassword('staff123');
      setSelectedRole('staff');
      login('staff@petcare.com', 'staff123', 'staff');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Graphic Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 mb-2">
            <Dog className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="block text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3.5 py-1 rounded-full w-max mx-auto border border-emerald-400/40">
            HỆ THỐNG QUẢN LÝ NỘI BỘ
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">PetCare Pro Dashboard</h1>
          <p className="text-xs font-bold text-slate-300">Dành riêng cho Quản trị viên & Nhân viên cửa hàng</p>
        </div>

        {/* Notice Badge */}
        <div className="bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 text-xs text-white space-y-1 shadow-inner">
          <p className="font-black text-amber-400 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> QUY ĐỊNH PHÂN QUYỀN NỘI BỘ:
          </p>
          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
            Chỉ chấp nhận tài khoản <strong className="text-emerald-400 font-black">Quản trị viên (Admin)</strong> và <strong className="text-amber-300 font-black">Nhân viên (Staff)</strong>. Khách hàng không được phép truy cập.
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-400 uppercase tracking-wider text-center">⚡ Đăng Nhập Nhanh 1-Click (Demo):</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs shadow-lg transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer hover:scale-105"
            >
              <span className="font-black text-sm">👑 Admin</span>
              <span className="text-[10px] text-slate-900 font-extrabold">Toàn quyền hệ thống</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('staff')}
              className="p-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs shadow-lg transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer hover:scale-105"
            >
              <span className="font-black text-sm">✂️ Nhân Viên</span>
              <span className="text-[10px] text-slate-900 font-extrabold">Đặt lịch & POS bán hàng</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t-2 border-slate-800"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400 uppercase font-black">Hoặc nhập thủ công</span>
          <div className="flex-grow border-t-2 border-slate-800"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/20 border-2 border-rose-500/50 rounded-2xl text-rose-300 text-xs font-black flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-white mb-1.5 uppercase tracking-wide">1. Chọn Vai Trò Đăng Nhập *</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-3.5 py-3 bg-slate-950 border-2 border-slate-700 rounded-xl text-xs text-white font-extrabold outline-none focus:border-emerald-400"
            >
              <option value="admin">👑 Quản trị viên (Admin Manager)</option>
              <option value="staff">✂️ Nhân viên cửa hàng (Store Staff)</option>
              <option value="customer">🚫 Khách hàng (Bị chặn truy cập)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-white mb-1.5 uppercase tracking-wide">2. Email Nội Bộ *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@petcare.com"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border-2 border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-extrabold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-white mb-1.5 uppercase tracking-wide">3. Mật Khẩu *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border-2 border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-extrabold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/30 transition-all mt-2 cursor-pointer uppercase tracking-wider"
          >
            Đăng Nhập Vào Hệ Thống Nội Bộ
          </button>
        </form>

        <div className="text-center text-xs font-bold text-slate-400">
          PetCare Pro Management System v2.5 • Security Encrypted
        </div>
      </div>
    </div>
  );
};
