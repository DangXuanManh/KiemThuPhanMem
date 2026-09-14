import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Badge } from '../ui/Badge';
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  ChevronDown, 
  CalendarPlus, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Crown,
  Scissors
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    setIsMobileDrawerOpen, 
    globalSearch, 
    setGlobalSearch,
    notifications,
    markNotificationAsRead,
    currentUser,
    logout,
    switchRole,
    setActiveTab
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitials = (name?: string) => {
    if (!name) return 'NV';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Global Search Bar */}
          <div className="relative w-48 sm:w-72 lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, thú cưng, lịch hẹn, SKU..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-2xl bg-slate-50/80 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Action Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Role Indicator Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            {currentUser?.role === 'admin' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Crown className="w-3.5 h-3.5" /> Quản Trị Viên (Admin)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300">
                <Scissors className="w-3.5 h-3.5" /> Nhân Viên (Staff)
              </span>
            )}
          </div>

          {/* Quick Create Appointment Button */}
          <button
            onClick={() => setActiveTab('appointments')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <CalendarPlus className="w-4 h-4" /> Đặt Lịch Hẹn
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(prev => !prev);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" /> Thông Báo Hệ Thống
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {unreadCount} mới
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        item.read ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-emerald-50/60 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{item.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(prev => !prev);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 font-black flex items-center justify-center border-2 border-emerald-500 text-xs shadow-sm">
                {getInitials(currentUser?.name)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase">{currentUser?.role === 'admin' ? '👑 Admin Manager' : '✂️ Store Staff'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 space-y-1">
                <div className="p-3 border-b border-slate-100 text-xs bg-slate-50 rounded-xl">
                  <p className="font-extrabold text-slate-900">{currentUser?.name}</p>
                  <p className="text-slate-500 text-[11px]">{currentUser?.email}</p>
                  <div className="mt-1">
                    <Badge variant={currentUser?.role === 'admin' ? 'purple' : 'info'}>
                      {currentUser?.role === 'admin' ? '👑 Quản Trị Viên' : '✂️ Nhân Viên'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">Đổi vai trò nhanh (Demo RBAC):</p>
                  <button
                    onClick={() => {
                      switchRole(currentUser?.role === 'admin' ? 'staff' : 'admin');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-500" /> 
                    Chuyển sang: {currentUser?.role === 'admin' ? '✂️ Quyền Nhân Viên' : '👑 Quyền Admin'}
                  </button>
                </div>

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" /> Cấu hình hệ thống
                  </button>
                )}

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" /> Đăng xuất khỏi hệ thống
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
