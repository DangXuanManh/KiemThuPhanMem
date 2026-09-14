import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Staff } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Award, 
  Calendar, 
  Scissors, 
  CheckCircle2, 
  Clock, 
  Briefcase
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { 
    staff, 
    addStaff, 
    updateStaff, 
    deleteStaff 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Groomer' as Staff['role'],
    phone: '',
    shift: 'Sáng' as Staff['shift'],
    status: 'Đang làm' as Staff['status'],
  });

  const roles = ['all', 'Chủ cửa hàng', 'Quản lý', 'Groomer', 'Nhân viên', 'Thu ngân'];

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      role: 'Groomer',
      phone: '',
      shift: 'Sáng',
      status: 'Đang làm',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      role: s.role,
      phone: s.phone,
      shift: s.shift,
      status: s.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, formData as any);
    } else {
      addStaff({
        ...formData,
        handledAppointments: 0,
        revenueGenerated: 0,
        permissions: ['view_appointments']
      } as any);
    }
    setIsModalOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Chủ cửa hàng':
      case 'Quản lý': return <Badge variant="purple"><Briefcase className="w-3 h-3 mr-1" /> {role}</Badge>;
      case 'Groomer': return <Badge variant="info"><Scissors className="w-3 h-3 mr-1" /> Groomer</Badge>;
      case 'Thu ngân': return <Badge variant="warning">💳 Thu ngân</Badge>;
      default: return <Badge variant="success">🫧 Nhân viên</Badge>;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Nhân Viên ({staff.length} Nhân Sự)</h1>
          <p className="text-xs text-slate-700 font-bold mt-1">Đội ngũ kỹ thuật viên cắt tỉa, spa, bác sĩ thú y và thu ngân nội bộ</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Nhân Viên Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm nhân viên theo tên, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-bold bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-extrabold text-slate-900">Chức vụ:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 text-xs border-2 border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r === 'all' ? 'Tất cả chức vụ' : r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center text-slate-700 font-bold rounded-3xl border border-slate-200">
            Không tìm thấy nhân viên.
          </div>
        ) : (
          filteredStaff.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 font-extrabold flex items-center justify-center text-base border-2 border-emerald-500 shadow-sm shrink-0">
                    {getInitials(s.name)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-tight">{s.name}</h3>
                    <div className="mt-1">{getRoleBadge(s.role)}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-800 font-bold bg-slate-100 p-3 rounded-2xl border-2 border-slate-300">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-600" /> <span className="text-slate-700 font-extrabold">SĐT:</span> <strong className="text-slate-900 font-black">{s.phone}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> <span className="text-slate-700 font-extrabold">Ca làm:</span> <strong className="text-slate-900 font-black">Ca {s.shift}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-emerald-100 border-2 border-emerald-300 p-2.5 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-900 uppercase tracking-wide">Ca Đã Hoàn Thành</p>
                    <p className="text-base font-black text-emerald-800">{s.handledAppointments || 0} ca</p>
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 p-2.5 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-wide">Doanh Số Tháng</p>
                    <p className="text-base font-black text-blue-800">{((s.revenueGenerated || 12500000) / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-slate-300 flex items-center justify-between">
                <Badge variant={s.status === 'Đang làm' ? 'success' : 'slate'}>
                  {s.status === 'Đang làm' ? 'Đang làm việc' : 'Đang nghỉ ca'}
                </Badge>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(s)}
                    className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                    title="Sửa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteStaff(s.id)}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Chỉnh Sửa Hồ Sơ Nhân Viên' : 'Thêm Nhân Viên Mới'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1">Họ và tên nhân viên *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Trần Hoàng Nam..."
              className="w-full px-3 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-extrabold text-slate-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1">Chức vụ *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-extrabold text-slate-900 bg-white"
              >
                <option value="Quản lý">Quản lý cửa hàng</option>
                <option value="Groomer">Groomer cắt tỉa</option>
                <option value="Nhân viên">Nhân viên Spa</option>
                <option value="Thu ngân">Thu ngân POS</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1">Ca làm việc *</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-extrabold text-slate-900 bg-white"
              >
                <option value="Sáng">Ca sáng (8h-16h)</option>
                <option value="Chiều">Ca chiều (14h-21h)</option>
                <option value="Cả ngày">Ca Full Day (8h-20h)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1">Số điện thoại *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0987654321"
              className="w-full px-3 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-extrabold text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1">Trạng thái ca</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-extrabold text-slate-900 bg-white"
            >
              <option value="Đang làm">Đang làm việc</option>
              <option value="Nghỉ ca">Đang nghỉ ca</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              {editingStaff ? 'Cập Nhật' : 'Tạo Nhân Viên'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
