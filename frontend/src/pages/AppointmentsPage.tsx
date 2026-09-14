import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  User, 
  Dog, 
  Scissors, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Clock3,
  CalendarDays,
  Filter
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { 
    appointments, 
    customers, 
    pets, 
    services, 
    staff, 
    addAppointment, 
    updateAppointmentStatus, 
    assignAppointmentStaff,
    deleteAppointment,
    globalSearch
  } = useStore();

  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterStaff, setFilterStaff] = useState<string>('');

  // 7-Step Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('09:00');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Filtered Appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      !globalSearch || 
      a.customerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      a.petName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(globalSearch.toLowerCase());

    const matchesStatus = !filterStatus || a.status === filterStatus;
    const matchesStaff = !filterStaff || a.staffId === filterStaff;

    return matchesSearch && matchesStatus && matchesStaff;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerPets = pets.filter(p => p.ownerId === selectedCustomerId);
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedPetId || !selectedServiceId) {
      alert('Vui lòng hoàn tất việc chọn Khách hàng, Thú cưng và Dịch vụ!');
      return;
    }

    addAppointment({
      customerId: selectedCustomerId,
      customerName: selectedCustomer?.name || 'Khách hàng',
      customerPhone: selectedCustomer?.phone || '',
      petId: selectedPetId,
      petName: selectedPet?.name || 'Thú cưng',
      petBreed: selectedPet?.breed,
      serviceId: selectedServiceId,
      serviceName: selectedService?.name || 'Dịch vụ Spa',
      date: bookingDate,
      time: bookingTime,
      staffId: selectedStaffId || staff[0].id,
      staffName: selectedStaff?.name || staff[0].name,
      status: 'Chờ xác nhận',
      notes: bookingNotes,
      totalPrice: selectedService?.price || 0
    });

    setIsBookingModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedCustomerId('');
    setSelectedPetId('');
    setSelectedServiceId('');
    setSelectedStaffId('');
    setBookingNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận': return <Badge variant="warning"><Clock3 className="w-3 h-3 mr-1" /> Chờ xác nhận</Badge>;
      case 'Đã xác nhận': return <Badge variant="info"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã xác nhận</Badge>;
      case 'Đang thực hiện': return <Badge variant="purple"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Đang thực hiện</Badge>;
      case 'Hoàn thành': return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Hoàn thành</Badge>;
      case 'Đã hủy': return <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" /> Đã hủy</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Lịch Hẹn & Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Theo dõi ca dịch vụ, thời gian hẹn và phân công Groomer</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                calendarView === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                calendarView === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                calendarView === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsBookingModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Đặt Lịch Hẹn Mới
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>

          <select
            value={filterStaff}
            onChange={(e) => setFilterStaff(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Tất cả nhân viên</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-extrabold text-slate-900">
          Hiển thị <span className="text-emerald-700 font-black">{filteredAppointments.length}</span> lịch hẹn
        </span>
      </div>

      {/* Appointments List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider border-b-2 border-slate-300">
              <tr>
                <th className="p-3.5">Mã đơn</th>
                <th className="p-3.5">Khách hàng</th>
                <th className="p-3.5">Thú cưng</th>
                <th className="p-3.5">Dịch vụ</th>
                <th className="p-3.5">Ngày & Khung giờ</th>
                <th className="p-3.5">Nhân viên phụ trách</th>
                <th className="p-3.5">Thành tiền</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-700 font-bold">
                    Không tìm thấy lịch hẹn phù hợp
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-black text-slate-900">#{app.code}</td>
                    <td className="p-3.5">
                      <p className="font-extrabold text-slate-900">{app.customerName}</p>
                      <p className="text-[11px] text-slate-700 font-semibold">{app.customerPhone}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                        🐾 {app.petName}
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">{app.serviceName}</td>
                    <td className="p-3.5">
                      <p className="font-extrabold text-slate-900">📅 {app.date}</p>
                      <p className="text-[11px] text-slate-800 font-black">⏰ {app.time}</p>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={app.staffId}
                        onChange={(e) => {
                          const sObj = staff.find(st => st.id === e.target.value);
                          if (sObj) assignAppointmentStaff(app.id, sObj.id, sObj.name);
                        }}
                        className="px-2 py-1 text-xs border rounded-xl bg-slate-50 font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {staff.map(st => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 font-extrabold text-emerald-600">
                      {app.totalPrice.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3.5">{getStatusBadge(app.status)}</td>
                    <td className="p-3.5 text-right space-x-1">
                      <select
                        value={app.status}
                        onChange={(e) => updateAppointmentStatus(app.id, e.target.value as any)}
                        className="px-2 py-1 text-xs border rounded-xl bg-white font-bold cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đang thực hiện">Đang thực hiện</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7-STEP BOOKING MODAL */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Form Đặt Lịch Hẹn Chăm Sóc Thú Cưng"
        subtitle={`Bước ${currentStep} / 7: ${
          currentStep === 1 ? 'Chọn Khách Hàng' :
          currentStep === 2 ? 'Chọn Thú Cưng' :
          currentStep === 3 ? 'Chọn Dịch Vụ' :
          currentStep === 4 ? 'Chọn Ngày & Giờ Hẹn' :
          currentStep === 5 ? 'Phân Công Groomer/Nhân Viên' :
          currentStep === 6 ? 'Ghi Chú Đặc Biệt' :
          'Xác Nhận & Tính Tiền'
        }`}
        maxWidth="max-w-2xl"
      >
        {/* Step Navigation Progress Bar */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div 
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center cursor-pointer transition-all ${
                currentStep === step 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/20 scale-110' 
                  : currentStep > step 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          {/* STEP 1: Select Customer */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">1. Chọn Khách Hàng *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {customers.map((c) => (
                  <label 
                    key={c.id}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedCustomerId === c.id 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="customer" 
                        value={c.id}
                        checked={selectedCustomerId === c.id}
                        onChange={() => {
                          setSelectedCustomerId(c.id);
                          // Auto select first pet
                          const userPetList = pets.filter(p => p.ownerId === c.id);
                          if (userPetList.length > 0) setSelectedPetId(userPetList[0].id);
                        }}
                        className="accent-emerald-500"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.phone}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {c.tier}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Pet */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">2. Chọn Thú Cưng Của Khách Hàng *</label>
              {customerPets.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  Vui lòng chọn khách hàng ở Bước 1 trước
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerPets.map((p) => (
                    <label 
                      key={p.id}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        selectedPetId === p.id 
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="pet" 
                        value={p.id}
                        checked={selectedPetId === p.id}
                        onChange={() => setSelectedPetId(p.id)}
                        className="accent-emerald-500"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">🐾 {p.name}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{p.species} • {p.breed}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Select Service */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">3. Chọn Dịch Vụ Spa / Grooming / Hotel *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {services.map((s) => (
                  <label 
                    key={s.id}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedServiceId === s.id 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input 
                        type="radio" 
                        name="service" 
                        value={s.id}
                        checked={selectedServiceId === s.id}
                        onChange={() => setSelectedServiceId(s.id)}
                        className="mt-0.5 accent-emerald-500"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{s.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.durationMins} phút</p>
                        <p className="text-xs font-extrabold text-emerald-600 mt-1">
                          {s.price.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Date & Time */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">4. Chọn Ngày Hẹn *</label>
                <input 
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khung Giờ Hẹn *</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="08:30">08:30 Sáng</option>
                  <option value="09:30">09:30 Sáng</option>
                  <option value="10:30">10:30 Sáng</option>
                  <option value="14:00">14:00 Chiều</option>
                  <option value="15:30">15:30 Chiều</option>
                  <option value="17:00">17:00 Chiều</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: Assign Staff */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">5. Phân Công Groomer / Kỹ Thuật Viên *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staff.map((st) => (
                  <label 
                    key={st.id}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedStaffId === st.id 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="staff" 
                      value={st.id}
                      checked={selectedStaffId === st.id}
                      onChange={() => setSelectedStaffId(st.id)}
                      className="accent-emerald-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{st.name}</p>
                      <p className="text-[10px] text-slate-500">{st.role} • Ca {st.shift}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Notes */}
          {currentStep === 6 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">6. Ghi Chú Yêu Cầu Cho Thú Cưng</label>
              <textarea 
                rows={4}
                placeholder="Ví dụ: Bé sợ tiếng sấy to, yêu cầu cắt bo tròn tai, vắt tuyến hôi cẩn thận..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="w-full p-3 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* STEP 7: Confirm & Summary */}
          {currentStep === 7 && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-extrabold text-sm text-emerald-400 pb-2 border-b border-slate-800">
                7. Xác Nhận Chi Tiết Lịch Hẹn
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <p>Khách hàng: <strong className="text-white">{selectedCustomer?.name || 'N/A'}</strong></p>
                <p>Thú cưng: <strong className="text-white">🐾 {selectedPet?.name || 'N/A'}</strong></p>
                <p>Dịch vụ: <strong className="text-white">{selectedService?.name || 'N/A'}</strong></p>
                <p>Kỹ thuật viên: <strong className="text-white">{selectedStaff?.name || 'Chưa chọn'}</strong></p>
                <p>Ngày & Giờ: <strong className="text-white">{bookingDate} lúc {bookingTime}</strong></p>
                <p>Tổng tiền: <strong className="text-emerald-400 text-base">{selectedService?.price.toLocaleString('vi-VN')} đ</strong></p>
              </div>
            </div>
          )}

          {/* Step Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Quay lại
              </button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow"
              >
                Tiếp theo →
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/30"
              >
                Xác Nhận Tạo Lịch Hẹn
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
