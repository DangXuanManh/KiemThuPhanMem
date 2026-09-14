import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Pet } from '../types';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Dog, 
  Cat, 
  User, 
  Weight, 
  Calendar, 
  ShieldCheck, 
  Scissors, 
  Activity,
  Heart,
  LayoutGrid,
  List
} from 'lucide-react';

export const PetsPage: React.FC = () => {
  const { 
    pets, 
    customers, 
    appointments, 
    addPet, 
    updatePet, 
    deletePet, 
    setActiveTab 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    customerId: '',
    species: 'Dog' as 'Dog' | 'Cat' | 'Other',
    breed: '',
    age: 1,
    weight: 3.5,
    gender: 'Đực' as Pet['gender'],
    vaccinations: 'Đã tiêm 7 bệnh',
    notes: '',
  });

  const filteredPets = pets.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || 
      (selectedType === 'Chó' && p.species === 'Dog') ||
      (selectedType === 'Mèo' && p.species === 'Cat');
    return matchesSearch && matchesType;
  });

  const handleOpenAddModal = () => {
    setEditingPet(null);
    setFormData({
      name: '',
      customerId: customers[0]?.id || '',
      species: 'Dog',
      breed: '',
      age: 2,
      weight: 4.5,
      gender: 'Đực',
      vaccinations: 'Đã tiêm phòng 7 bệnh đầy đủ',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Pet) => {
    setEditingPet(p);
    setFormData({
      name: p.name,
      customerId: p.ownerId || p.customerId || '',
      species: p.species || 'Dog',
      breed: p.breed,
      age: p.age,
      weight: p.weight,
      gender: p.gender,
      vaccinations: (p as any).vaccinations || 'Đã tiêm phòng đầy đủ',
      notes: p.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const ownerName = customer ? customer.name : 'Khách vãng lai';

    if (editingPet) {
      updatePet(editingPet.id, {
        ...formData,
        ownerName,
        ownerId: formData.customerId,
      } as any);
    } else {
      addPet({
        ...formData,
        ownerName,
        ownerId: formData.customerId,
      } as any);
    }
    setIsAddModalOpen(false);
  };

  const handleViewDetail = (p: Pet) => {
    setSelectedPet(p);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Thú Cưng</h1>
          <p className="text-xs text-slate-500 mt-1">Hồ sơ sức khỏe, tiêm phòng và lịch sử dịch vụ của bé</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Thú Cưng Mới
        </button>
      </div>

      {/* Filter and View Mode Switch */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên bé, giống loài, chủ nuôi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-900">Loài:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs border-2 border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Tất cả loài</option>
              <option value="Chó">🐶 Chó</option>
              <option value="Mèo">🐱 Mèo</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Xem Dạng Thẻ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Xem Dạng Bảng"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPets.length === 0 ? (
            <div className="col-span-full bg-white p-8 text-center text-slate-700 font-bold rounded-3xl border border-slate-200">
              Không tìm thấy thú cưng nào.
            </div>
          ) : (
            filteredPets.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border ${
                        p.species === 'Cat' ? 'bg-purple-100 border-purple-200' : 'bg-emerald-100 border-emerald-200'
                      }`}>
                        {p.species === 'Cat' ? '🐱' : '🐶'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{p.name}</h3>
                        <p className="text-xs text-slate-700 font-bold">{p.breed}</p>
                      </div>
                    </div>
                    <Badge variant={p.species === 'Cat' ? 'purple' : 'info'}>
                      {p.species === 'Cat' ? 'Mèo' : 'Chó'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-800 bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
                    <div>⚖️ Cân nặng: <span className="font-extrabold text-slate-900">{p.weight} kg</span></div>
                    <div>🎂 Tuổi: <span className="font-extrabold text-slate-900">{p.age} tuổi</span></div>
                    <div>⚧️ Giới tính: <span className="font-extrabold text-slate-900">{p.gender}</span></div>
                    <div>💉 Tiêm phòng: <span className="font-extrabold text-emerald-800">Đã tiêm</span></div>
                  </div>

                  <p className="text-xs text-slate-800 flex items-center gap-1 font-bold">
                    <User className="w-3.5 h-3.5 text-slate-600 shrink-0" /> Chủ nuôi: <span className="font-extrabold text-slate-900 truncate">{p.ownerName || p.customerName}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleViewDetail(p)}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1 border border-emerald-300"
                  >
                    <Eye className="w-3.5 h-3.5" /> Hồ Sơ
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 transition-colors"
                      title="Sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePet(p.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-700 transition-colors"
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
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider border-b-2 border-slate-300">
                <tr>
                  <th className="p-4">Thú Cưng</th>
                  <th className="p-4">Loài & Giống</th>
                  <th className="p-4">Thông Số Sức Khỏe</th>
                  <th className="p-4">Chủ Nuôi</th>
                  <th className="p-4">Tình Trạng Tiêm Phòng</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPets.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                          {p.species === 'Cat' ? '🐱' : '🐶'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                          <p className="text-slate-400 text-[11px]">{p.gender} • {p.age} tuổi</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{p.breed}</p>
                        <Badge variant={p.species === 'Cat' ? 'purple' : 'info'}>{p.species === 'Cat' ? 'Mèo' : 'Chó'}</Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                        ⚖️ {p.weight} kg
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{p.ownerName || p.customerName}</td>
                    <td className="p-4 text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Đã tiêm vắc-xin 7 bệnh
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleViewDetail(p)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        title="Hồ Sơ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                        title="Sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePet(p.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pet Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Hồ Sơ Sức Khỏe & Dịch Vụ Thú Cưng"
      >
        {selectedPet && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0">
                  {selectedPet.species === 'Cat' ? '🐱' : '🐶'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold">{selectedPet.name}</h2>
                    <Badge variant={selectedPet.species === 'Cat' ? 'purple' : 'info'}>{selectedPet.species === 'Cat' ? 'Mèo' : 'Chó'}</Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Giống: {selectedPet.breed}</p>
                  <p className="text-xs text-slate-300">Chủ sở hữu: <span className="font-bold text-emerald-400">{selectedPet.ownerName || selectedPet.customerName}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                <div className="bg-slate-800/80 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cân Nặng</p>
                  <p className="text-sm font-extrabold text-emerald-300">{selectedPet.weight} kg</p>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Tuổi</p>
                  <p className="text-sm font-extrabold text-emerald-300">{selectedPet.age} tuổi</p>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Giới Tính</p>
                  <p className="text-sm font-extrabold text-emerald-300">{selectedPet.gender}</p>
                </div>
              </div>
            </div>

            {/* Medical & Vaccination Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Tình Trạng Tiêm Phòng & Sức Khỏe
              </h3>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 font-semibold">
                💉 Lịch tiêm: Tiêm phòng 7 bệnh định kỳ năm 2026
              </p>
              {selectedPet.notes && (
                <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  ⚠️ Lưu ý đặc biệt: {selectedPet.notes}
                </p>
              )}
            </div>

            {/* History of Services Rendered */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-purple-500" /> Lịch Sử Dịch Vụ Đã Làm
                </h3>
                <button
                  onClick={() => { setIsDetailOpen(false); setActiveTab('appointments'); }}
                  className="text-xs font-extrabold text-emerald-600 hover:underline"
                >
                  + Đặt dịch vụ mới
                </button>
              </div>

              <div className="space-y-2">
                {appointments.filter(a => a.petName === selectedPet.name).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa có lịch sử sử dụng dịch vụ spa/grooming.</p>
                ) : (
                  appointments.filter(a => a.petName === selectedPet.name).map(a => (
                    <div key={a.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">✂️ {a.serviceName}</p>
                        <p className="text-[10px] text-slate-500">Ngày: {a.date} ({a.time}) • NV: {a.staffName}</p>
                      </div>
                      <Badge variant={a.status === 'Hoàn thành' ? 'success' : 'warning'}>{a.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add / Edit Pet Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingPet ? 'Cập Nhật Hồ Sơ Thú Cưng' : 'Đăng Ký Thú Cưng Mới'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên bé thú cưng *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Cún Lu, Mèo Béo..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chủ sở hữu (Khách hàng) *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Loài *</label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              >
                <option value="Dog">Chó 🐶</option>
                <option value="Cat">Mèo 🐱</option>
                <option value="Other">Khác 🐰</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giống *</label>
              <input
                type="text"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="VD: Poodle, Corgi, Alabai..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              >
                <option value="Đực">Đực</option>
                <option value="Cái">Cái</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cân nặng (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tuổi</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tình trạng tiêm phòng</label>
            <input
              type="text"
              value={formData.vaccinations}
              onChange={(e) => setFormData({ ...formData, vaccinations: e.target.value })}
              placeholder="VD: Tiêm phòng 7 bệnh năm 2026, dại..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lưu ý sức khỏe / tính cách</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="VD: Dễ giật mình, dị ứng xà phòng chanh, thân thiện..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              {editingPet ? 'Cập Nhật' : 'Tạo Thú Cưng'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
