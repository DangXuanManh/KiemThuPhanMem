import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/auth/LoginScreen';

import { DashboardPage } from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { CustomersPage } from './pages/CustomersPage';
import { PetsPage } from './pages/PetsPage';
import { ServicesPage } from './pages/ServicesPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { StaffPage } from './pages/StaffPage';
import { CrmPage } from './pages/CrmPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShieldAlert, Crown } from 'lucide-react';

function DashboardLayout() {
  const { activeTab, currentUser, switchRole } = useStore();

  const adminOnlyTabs = ['services', 'staff', 'promotions', 'crm', 'reports', 'settings'];
  const isAdmin = currentUser?.role === 'admin';

  const renderActivePage = () => {
    if (adminOnlyTabs.includes(activeTab) && !isAdmin) {
      return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto my-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Yêu Cầu Quyền Quản Trị Viên (Admin)</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Phân hệ này dành riêng cho Quản trị viên để thiết lập bảng giá dịch vụ, quản lý nhân sự, mã giảm giá và xem báo cáo tài chính.
            Tài khoản Nhân viên hiện tại không được cấp quyền truy cập.
          </p>
          <button 
            onClick={() => switchRole('admin')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Crown className="w-4 h-4" /> Chuyển Sang Quyền Admin (Demo)
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'pets':
        return <PetsPage />;
      case 'services':
        return <ServicesPage />;
      case 'orders':
        return <OrdersPage />;
      case 'products':
        return <ProductsPage />;
      case 'staff':
        return <StaffPage />;
      case 'crm':
        return <CrmPage />;
      case 'promotions':
        return <PromotionsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-3xl">
            <h1 className="text-2xl font-extrabold text-slate-900">Hướng Dẫn Phân Quyền Nội Bộ</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống PetCare Pro chia làm 2 cấp bậc phân quyền rõ ràng:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                <p className="font-extrabold text-emerald-900">👑 Quyền Quản Trị Viên (Admin):</p>
                <p className="text-emerald-800 text-[11px]">
                  Toàn quyền hệ thống: Quản lý nhân viên, tỷ lệ hoa hồng, chỉnh bảng giá dịch vụ, cấu hình hệ thống, tạo mã voucher và báo cáo doanh thu tài chính.
                </p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                <p className="font-extrabold text-amber-900">✂️ Quyền Nhân Viên (Staff):</p>
                <p className="text-amber-800 text-[11px]">
                  Nghiệp vụ hằng ngày: Đặt lịch spa/grooming cho khách, thanh toán đơn hàng tại quầy POS, tra cứu hồ sơ thú cưng, khách hàng và kiểm tra kho hàng.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <DashboardLayout />;
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
