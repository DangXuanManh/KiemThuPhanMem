export type MemberTier = 'Kim Cương' | 'Vàng' | 'Bạc' | 'Đồng';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  petsCount: number;
  totalSpent: number;
  lastVisit: string;
  tier: MemberTier;
  status: 'Hoạt động' | 'Khóa';
  points: number;
  notes?: string;
  createdAt: string;
}

export interface PetMedicalRecord {
  id: string;
  date: string;
  serviceType: string;
  weight: number;
  technician: string;
  notes: string;
}

export interface Pet {
  id: string;
  name: string;
  avatar?: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  gender: 'Đực' | 'Cái';
  birthDate: string;
  age: number;
  weight: number;
  coatColor: string;
  ownerId: string;
  ownerName: string;
  notes?: string;
  groomingHistoryCount: number;
  stayHistoryCount: number;
  medicalHistory: PetMedicalRecord[];
}

export type ServiceCategory = 
  | 'Tắm & vệ sinh' 
  | 'Cắt tỉa lông' 
  | 'Spa' 
  | 'Cắt móng' 
  | 'Vệ sinh tai' 
  | 'Trông giữ' 
  | 'Khách sạn thú cưng';

export interface Service {
  id: string;
  name: string;
  image?: string;
  category: ServiceCategory;
  price: number;
  durationMins: number;
  description: string;
  active: boolean;
}

export type AppointmentStatus = 
  | 'Chờ xác nhận' 
  | 'Đã xác nhận' 
  | 'Đang thực hiện' 
  | 'Hoàn thành' 
  | 'Đã hủy';

export interface Appointment {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  petId: string;
  petName: string;
  petBreed?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  staffId: string;
  staffName: string;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
}

export type ProductCategory = 'Thức ăn' | 'Pate' | 'Phụ kiện' | 'Đồ chơi' | 'Vệ sinh';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  sellPrice: number;
  importPrice: number;
  stock: number;
  minStockAlert: number;
  status: 'Bình thường' | 'Cảnh báo hết' | 'Hết hàng';
}

export interface OrderItem {
  productId?: string;
  productName?: string;
  name?: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Chờ thanh toán' | 'Đã thanh toán' | 'Hoàn thành' | 'Đã hủy';

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  date: string;
  createdAt?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ' | 'Ví QR';
  status: OrderStatus;
  notes?: string;
}

export type StaffRole = 'Chủ cửa hàng' | 'Quản lý' | 'Nhân viên' | 'Groomer' | 'Thu ngân';

export interface Staff {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  role: StaffRole;
  shift: 'Sáng' | 'Chiều' | 'Cả ngày';
  status: 'Đang làm' | 'Nghỉ ca';
  handledAppointments: number;
  revenueGenerated: number;
  permissions: string[];
}

export interface Promotion {
  id: string;
  code: string;
  name?: string;
  title?: string;
  discountType: 'percent' | 'fixed' | 'percentage';
  value?: number;
  discountValue?: number;
  validUntil?: string;
  startDate?: string;
  endDate?: string;
  usageCount?: number;
  usedCount?: number;
  maxUsage?: number;
  usageLimit?: number;
  minOrderValue?: number;
  targetSegment?: string;
  status?: 'Hoạt động' | 'Hết hạn' | 'Tạm dừng';
  isActive?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'order' | 'stock' | 'crm';
}
