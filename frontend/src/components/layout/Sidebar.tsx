import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Dog, 
  Scissors, 
  ShoppingBag, 
  Package, 
  UserCheck, 
  Ticket, 
  HeartHandshake, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  X,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  adminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    appointments,
    products,
    currentUser
  } = useStore();

  const pendingAppointments = appointments.filter(a => a.status === 'Chờ xác nhận').length;
  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;
  const isAdmin = currentUser?.role === 'admin';

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'appointments', label: 'Lịch hẹn (Đặt ca)', icon: CalendarDays, badge: pendingAppointments || undefined },
    { id: 'orders', label: 'Bán hàng (POS)', icon: ShoppingBag },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'pets', label: 'Thú cưng', icon: Dog },
    { id: 'products', label: 'Sản phẩm & Kho', icon: Package, badge: lowStockCount ? `${lowStockCount} !` : undefined },
    { id: 'services', label: 'Quản lý Dịch vụ', icon: Scissors, adminOnly: true },
    { id: 'staff', label: 'Quản lý Nhân viên', icon: UserCheck, adminOnly: true },
    { id: 'promotions', label: 'Quản lý Voucher', icon: Ticket, adminOnly: true },
    { id: 'crm', label: 'CRM & CSKH', icon: HeartHandshake, adminOnly: true },
    { id: 'reports', label: 'Báo cáo Doanh thu', icon: BarChart3, adminOnly: true },
    { id: 'settings', label: 'Cấu hình Hệ thống', icon: Settings, adminOnly: true },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMobileDrawerOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-emerald-500/20 shrink-0">
            <Dog className="w-6 h-6 stroke-[2.5]" />
          </div>
          {(!isSidebarCollapsed || isMobileDrawerOpen) && (
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                PetCare <span className="text-emerald-400 font-extrabold">PRO</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400">Store Management SaaS</p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {!isMobileDrawerOpen && (
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobileDrawerOpen && (
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Notice Badge in Sidebar */}
      {(!isSidebarCollapsed || isMobileDrawerOpen) && (
        <div className="px-4 pt-3">
          <div className={`p-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-between border ${
            isAdmin ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/70 border-amber-500/30 text-amber-300'
          }`}>
            <span className="flex items-center gap-1.5">
              {isAdmin ? <Crown className="w-4 h-4 text-emerald-400" /> : <Scissors className="w-4 h-4 text-amber-400" />}
              {isAdmin ? 'Quyền: Quản Trị Viên' : 'Quyền: Nhân Viên'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRestricted = item.adminOnly && !isAdmin;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              title={isSidebarCollapsed && !isMobileDrawerOpen ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20' 
                  : isRestricted
                  ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 opacity-75'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : isRestricted ? 'text-amber-500/70' : 'text-slate-400'}`} />
              {(!isSidebarCollapsed || isMobileDrawerOpen) && (
                <span className="flex-1 text-left line-clamp-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  {isRestricted && (
                    <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5 ml-1">
                      <Lock className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </span>
              )}
              {(!isSidebarCollapsed || isMobileDrawerOpen) && item.badge && !isRestricted && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                  isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Banner */}
      {(!isSidebarCollapsed || isMobileDrawerOpen) && (
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-[11px]">
              <p className="font-bold text-slate-200">PetCare Pro System</p>
              <p className="text-slate-400 text-[10px]">Phân quyền RBAC nội bộ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div 
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out md:hidden ${
        isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {navContent}
      </aside>
    </>
  );
};
