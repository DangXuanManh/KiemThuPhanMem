import { 
  Customer, 
  Pet, 
  Service, 
  Appointment, 
  Product, 
  Order, 
  Staff, 
  Promotion, 
  NotificationItem 
} from '../types';

export const initialStaff: Staff[] = [
  {
    id: 'st-1',
    name: 'Nguyễn Văn Minh',
    phone: '0988111222',
    role: 'Chủ cửa hàng',
    shift: 'Cả ngày',
    status: 'Đang làm',
    handledAppointments: 142,
    revenueGenerated: 45000000,
    permissions: ['all']
  },
  {
    id: 'st-2',
    name: 'Trần Thị Thu Hà',
    phone: '0912333444',
    role: 'Quản lý',
    shift: 'Sáng',
    status: 'Đang làm',
    handledAppointments: 98,
    revenueGenerated: 28000000,
    permissions: ['manage_appointments', 'manage_customers', 'manage_inventory', 'reports']
  },
  {
    id: 'st-3',
    name: 'Lê Hoàng Hải',
    phone: '0977444555',
    role: 'Groomer',
    shift: 'Sáng',
    status: 'Đang làm',
    handledAppointments: 185,
    revenueGenerated: 36000000,
    permissions: ['view_appointments', 'update_appointment_status']
  },
  {
    id: 'st-4',
    name: 'Phạm Bảo Anh',
    phone: '0933555666',
    role: 'Groomer',
    shift: 'Chiều',
    status: 'Đang làm',
    handledAppointments: 160,
    revenueGenerated: 32000000,
    permissions: ['view_appointments', 'update_appointment_status']
  },
  {
    id: 'st-5',
    name: 'Vũ Quốc Khánh',
    phone: '0966777888',
    role: 'Thu ngân',
    shift: 'Sáng',
    status: 'Đang làm',
    handledAppointments: 75,
    revenueGenerated: 19000000,
    permissions: ['manage_orders', 'pos']
  },
  {
    id: 'st-6',
    name: 'Hoàng Mộc Trà',
    phone: '0944888999',
    role: 'Nhân viên',
    shift: 'Chiều',
    status: 'Đang làm',
    handledAppointments: 54,
    revenueGenerated: 12000000,
    permissions: ['manage_customers', 'manage_pets']
  },
  {
    id: 'st-7',
    name: 'Đặng Tuấn Tú',
    phone: '0922111333',
    role: 'Groomer',
    shift: 'Cả ngày',
    status: 'Nghỉ ca',
    handledAppointments: 110,
    revenueGenerated: 24000000,
    permissions: ['view_appointments']
  },
  {
    id: 'st-8',
    name: 'Đỗ Phương Thảo',
    phone: '0955222444',
    role: 'Thu ngân',
    shift: 'Chiều',
    status: 'Đang làm',
    handledAppointments: 62,
    revenueGenerated: 15000000,
    permissions: ['manage_orders']
  },
  {
    id: 'st-9',
    name: 'Bùi Đức Anh',
    phone: '0988333555',
    role: 'Groomer',
    shift: 'Sáng',
    status: 'Đang làm',
    handledAppointments: 88,
    revenueGenerated: 18000000,
    permissions: ['view_appointments']
  },
  {
    id: 'st-10',
    name: 'Ngô Thanh Hằng',
    phone: '0977666999',
    role: 'Nhân viên',
    shift: 'Chiều',
    status: 'Đang làm',
    handledAppointments: 40,
    revenueGenerated: 9000000,
    permissions: ['manage_pets']
  },
  {
    id: 'st-11',
    name: 'Phan Văn Đức (Vet Doctor)',
    phone: '0918222333',
    role: 'Quản lý',
    shift: 'Cả ngày',
    status: 'Đang làm',
    handledAppointments: 120,
    revenueGenerated: 42000000,
    permissions: ['all']
  },
  {
    id: 'st-12',
    name: 'Trịnh Khánh Ly',
    phone: '0938444777',
    role: 'Groomer',
    shift: 'Sáng',
    status: 'Đang làm',
    handledAppointments: 95,
    revenueGenerated: 21000000,
    permissions: ['view_appointments']
  },
  {
    id: 'st-13',
    name: 'Nguyễn Thành Nam',
    phone: '0909555888',
    role: 'Groomer',
    shift: 'Chiều',
    status: 'Đang làm',
    handledAppointments: 104,
    revenueGenerated: 25500000,
    permissions: ['view_appointments']
  },
  {
    id: 'st-14',
    name: 'Lương Bảo Châu',
    phone: '0945666111',
    role: 'Nhân viên',
    shift: 'Sáng',
    status: 'Đang làm',
    handledAppointments: 48,
    revenueGenerated: 11500000,
    permissions: ['manage_customers']
  },
  {
    id: 'st-15',
    name: 'Cao Hoàng Yến',
    phone: '0967333222',
    role: 'Thu ngân',
    shift: 'Chiều',
    status: 'Nghỉ ca',
    handledAppointments: 82,
    revenueGenerated: 17800000,
    permissions: ['manage_orders']
  }
];

export const initialServices: Service[] = [
  {
    id: 'svc-1',
    name: 'Tắm Spa & Cắt Lông Toàn Diện (Poodle/Mèo)',
    category: 'Cắt tỉa lông',
    price: 280000,
    durationMins: 90,
    description: 'Tắm sấy khử mùi thảo dược, chải lông rụng, vắt tuyến hôi, vệ sinh tai, cắt móng và tạo kiểu bo tròn.',
    active: true
  },
  {
    id: 'svc-2',
    name: 'Khách Sạn Lưu Trú Thú Cưng VIP (1 Ngày)',
    category: 'Khách sạn thú cưng',
    price: 220000,
    durationMins: 1440,
    description: 'Phòng máy lạnh 24/7, camera theo dõi, 3 bữa ăn hạt Royal Canin/pate cá hồi, khu chơi thả rông.',
    active: true
  },
  {
    id: 'svc-3',
    name: 'Khám Sức Khỏe & Tiêm Vắc-Xin 7 Bệnh',
    category: 'Spa',
    price: 350000,
    durationMins: 45,
    description: 'Khám tổng quát tai mũi họng, nghe nhịp tim, siêu âm định kỳ và tiêm phòng 7 bệnh nguy hiểm.',
    active: true
  },
  {
    id: 'svc-4',
    name: 'Vệ Sinh Răng Miệng & Lấy Cao Răng Siêu Âm',
    category: 'Vệ sinh tai',
    price: 160000,
    durationMins: 30,
    description: 'Lấy mảng bám rắng siêu âm dịu nhẹ, xịt diệt khuẩn khử hôi miệng.',
    active: true
  },
  {
    id: 'svc-5',
    name: 'Tắm Thảo Dược Dưỡng Lông Mượt Chó Mèo',
    category: 'Tắm & vệ sinh',
    price: 150000,
    durationMins: 45,
    description: 'Tắm dầu xả cao cấp Joy Spa giúp hết ve rận, mượt lông và thơm lâu 7 ngày.',
    active: true
  },
  {
    id: 'svc-6',
    name: 'Cắt Móng & Mài Nhẵn An Toàn',
    category: 'Cắt móng',
    price: 60000,
    durationMins: 20,
    description: 'Cắt tỉa móng chuyên dụng tránh phạm tủy, mài mịn góc móng tránh cào xước.',
    active: true
  },
  {
    id: 'svc-7',
    name: 'Vệ Sinh Tai & Nhổ Lông Tai',
    category: 'Vệ sinh tai',
    price: 80000,
    durationMins: 25,
    description: 'Làm sạch rận tai, nhổ lông tai sâu tránh viêm nhiễm mùi hôi.',
    active: true
  },
  {
    id: 'svc-8',
    name: 'Trông Giữ Thú Cưng Theo Giờ (Nửa Ngày)',
    category: 'Trông giữ',
    price: 100000,
    durationMins: 240,
    description: 'Nhận trông giữ thú cưng khi chủ bận, có nhân viên dắt đi dạo và cho ăn.',
    active: false
  },
  {
    id: 'svc-9',
    name: 'Gói Cắt Tỉa Tạo Kiểu Hàn Quốc (Teddy/Nấm)',
    category: 'Cắt tỉa lông',
    price: 320000,
    durationMins: 120,
    description: 'Cắt tỉa nghệ thuật chuẩn style Hàn Quốc Teddy Bear cho Corgi, Poodle, Phốc Hươu.',
    active: true
  },
  {
    id: 'svc-10',
    name: 'Tắm Muối Khoáng Xả Stress Thư Giãn',
    category: 'Spa',
    price: 200000,
    durationMins: 60,
    description: 'Ngâm bồn muối khoáng bọt mịn massage thả lỏng cơ thể.',
    active: true
  }
];

export const initialCustomers: Customer[] = Array.from({ length: 30 }, (_, i) => {
  const names = [
    'Nguyễn Văn An', 'Trần Thị Mai', 'Lê Hoàng Nam', 'Phạm Quỳnh Anh', 'Vũ Minh Trí',
    'Bùi Thu Trang', 'Hoàng Bảo Long', 'Đặng Kim Ngân', 'Đỗ Thanh Tùng', 'Nông Văn Hùng',
    'Trịnh Phương Thảo', 'Dương Quốc Anh', 'Lý Mỹ Linh', 'Phan Văn Đức', 'Ngô Bảo Ngọc',
    'Trương Quốc Bảo', 'Đoàn Thanh Vân', 'Lương Minh Châu', 'Hồ Tấn Tài', 'Mai Thu Cúc',
    'Đinh Tiến Dũng', 'Khuất Thu Hà', 'Tạ Thành Công', 'Lại Bích Phương', 'Tô Hoài Nam',
    'Chu Khánh Linh', 'Vũ Đình Trọng', 'Tào Thanh Hải', 'Nghiêm Đức Mạnh', 'Lâm Khánh Chi'
  ];
  const tiers: ('Kim Cương' | 'Vàng' | 'Bạc' | 'Đồng')[] = ['Kim Cương', 'Vàng', 'Bạc', 'Đồng'];
  const name = names[i % names.length];
  const petsCount = (i % 3) + 1;
  const totalSpent = (i + 1) * 850000;
  const tier = tiers[i % 4];

  return {
    id: `cust-${i + 1}`,
    code: `KH-${1000 + i + 1}`,
    name,
    phone: `098${Math.floor(1000000 + Math.random() * 9000000)}`,
    email: `customer${i + 1}@gmail.com`,
    petsCount,
    totalSpent,
    lastVisit: `2026-09-0${(i % 8) + 1}`,
    tier,
    status: 'Hoạt động',
    points: Math.floor(totalSpent / 10000),
    notes: i % 5 === 0 ? 'Khách quen, yêu cầu tắm nước ấm' : 'Thích dắt chó đi dạo trước khi tắm',
    createdAt: '2026-01-15'
  };
});

export const initialPets: Pet[] = Array.from({ length: 40 }, (_, i) => {
  const petNames = [
    'Bông', 'Miu Miu', 'Lucky', 'Kuro', 'Simba', 'Mochi', 'Bin', 'Lu', 'Chó Bự', 'Sushi',
    'Coco', 'Tobi', 'Max', 'Milo', 'Bella', 'Charlie', 'Luna', 'Teddy', 'Zoe', 'Cooper',
    'Nấm', 'Đậu Đậu', 'Xoài', 'Quýt', 'Bơ', 'Trà Sữa', 'Cà Phê', 'Cookie', 'Mật Mật', 'Bánh Tiêu',
    'Pudding', 'Cacao', 'Matcha', 'Kem', 'Bé Bắp', 'Hạt Dẻ', 'Sữa', 'Nếp', 'Cơm', 'Vàng'
  ];
  const breeds = ['Poodle Mini', 'Mèo Anh Lông Ngắn', 'Corgi Pembroke', 'Phốc Hươu', 'Mèo Phù Thủy', 'Golden Retriever', 'Husky Siberian', 'Pug'];
  const owner = initialCustomers[i % initialCustomers.length];

  return {
    id: `pet-${i + 1}`,
    name: petNames[i],
    species: i % 3 === 0 ? 'Cat' : 'Dog',
    breed: breeds[i % breeds.length],
    gender: i % 2 === 0 ? 'Đực' : 'Cái',
    birthDate: '2024-05-12',
    age: (i % 4) + 1,
    weight: 3.5 + (i % 6),
    coatColor: i % 2 === 0 ? 'Trắng kem' : 'Nâu xám',
    ownerId: owner.id,
    ownerName: owner.name,
    notes: 'Hiền lành, dị ứng thức ăn hải sản, nhạy cảm tiếng sấy',
    groomingHistoryCount: (i % 5) + 2,
    stayHistoryCount: i % 3,
    medicalHistory: [
      {
        id: `med-${i}-1`,
        date: '2026-08-10',
        serviceType: 'Tiêm phòng vắc-xin 7 bệnh',
        weight: 4.2,
        technician: 'Lê Hoàng Hải',
        notes: 'Tiêm nhắc lại hàng năm, sức khỏe tốt'
      }
    ]
  };
});

export const initialProducts: Product[] = Array.from({ length: 50 }, (_, i) => {
  const prodNames = [
    'Hạt Dinh Dưỡng Royal Canin Poodle (1.5kg)', 'Pate Cho Mèo Whiskas Vị Cá Hồi (400g)',
    'Đồ Chơi Cần Câu Mèo Lông Vũ', 'Sữa Tắm Thảo Dược Joy Spa (500ml)', 'Vòng Cổ Chuông Đeo Chó Mèo',
    'Cát Vệ Sinh Cho Mèo Đậu Nành Tofu', 'Bát Ăn Inox Chống Trượt', 'Xịt Khử Mùi Hôi Chuồng Trồng',
    'Xương Canxi Gặm Sạch Răng Chó', 'Bánh Thưởng Snack Cho Mèo Vị Gà', 'Lược Chải Lông Rụng Thú Cưng',
    'Máy Lọc Nước Thú Cưng Tự Động', 'Nhà Cây Cho Mèo Cat Tree', 'Đệm Ngủ Phòng Máy Lạnh',
    'Bao Tay Massage Tắm Chó Mèo', 'Tã Bỉm Vệ Sinh Chó Đực', 'Cỏ Mèo Catnip Xả Stress',
    'Sữa Bột Dinh Dưỡng Cho Cún Sơ Sinh', 'Dầu Dưỡng Lông Omega 3', 'Balo Phi Hành Gia Vận Chuyển',
    'Chuồng Sắt Sơn Tĩnh Điện VIP', 'Túi Xách Vận Chuyển Chó Mèo', 'Clipper Tông Đơ Cắt Lông Thú Cưng',
    'Thuốc Nhỏ Rận Tai Frontline', 'Thuốc Xổ Giun Định Kỳ Drontal'
  ];

  const name = prodNames[i % prodNames.length] + ` (Loại ${Math.floor(i / 25) + 1})`;
  const stock = i === 3 || i === 8 ? 2 : 15 + (i * 3) % 40;
  const minStockAlert = 5;

  return {
    id: `prod-${i + 1}`,
    sku: `SKU-PET-${100 + i + 1}`,
    name,
    category: (['Thức ăn', 'Pate', 'Phụ kiện', 'Đồ chơi', 'Vệ sinh'] as const)[i % 5],
    sellPrice: 50000 + (i * 15000),
    importPrice: 30000 + (i * 10000),
    stock,
    minStockAlert,
    status: stock === 0 ? 'Hết hàng' : stock <= minStockAlert ? 'Cảnh báo hết' : 'Bình thường'
  };
});

export const initialAppointments: Appointment[] = Array.from({ length: 30 }, (_, i) => {
  const statuses: ('Chờ xác nhận' | 'Đã xác nhận' | 'Đang thực hiện' | 'Hoàn thành' | 'Đã hủy')[] = 
    ['Chờ xác nhận', 'Đã xác nhận', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'];
  
  const cust = initialCustomers[i % initialCustomers.length];
  const pet = initialPets[i % initialPets.length];
  const svc = initialServices[i % initialServices.length];
  const staff = initialStaff[i % initialStaff.length];

  return {
    id: `app-${i + 1}`,
    code: `LH-${2000 + i + 1}`,
    customerId: cust.id,
    customerName: cust.name,
    customerPhone: cust.phone,
    petId: pet.id,
    petName: pet.name,
    petBreed: pet.breed,
    serviceId: svc.id,
    serviceName: svc.name,
    date: `2026-09-09`,
    time: `${8 + (i % 10)}:30`,
    staffId: staff.id,
    staffName: staff.name,
    status: statuses[i % statuses.length],
    notes: 'Yêu cầu sấy bông tỉ mỉ, cắt bo tròn mặt',
    totalPrice: svc.price
  };
});

export const initialOrders: Order[] = Array.from({ length: 30 }, (_, i) => {
  const cust = initialCustomers[i % initialCustomers.length];
  const prod = initialProducts[i % initialProducts.length];
  const statuses: ('Chờ thanh toán' | 'Đã thanh toán' | 'Hoàn thành' | 'Đã hủy')[] = 
    ['Đã thanh toán', 'Hoàn thành', 'Chờ thanh toán', 'Đã hủy'];

  return {
    id: `ord-${i + 1}`,
    code: `DH-${5000 + i + 1}`,
    customerId: cust.id,
    customerName: cust.name,
    date: '2026-09-09',
    items: [
      {
        productId: prod.id,
        productName: prod.name,
        quantity: (i % 3) + 1,
        price: prod.sellPrice
      }
    ],
    totalAmount: prod.sellPrice * ((i % 3) + 1),
    discountAmount: 20000,
    paymentMethod: i % 2 === 0 ? 'Tiền mặt' : 'Chuyển khoản',
    status: statuses[i % statuses.length]
  };
});

export const initialPromotions: Promotion[] = [
  {
    id: 'promo-1',
    code: 'PETCARE2026',
    title: 'Giảm 10% Cho Dịch Vụ Grooming Lần Đầu',
    discountType: 'percent',
    value: 10,
    validUntil: '2026-10-31',
    usageCount: 45,
    maxUsage: 100,
    targetSegment: 'Tất cả khách hàng',
    status: 'Hoạt động'
  },
  {
    id: 'promo-2',
    code: 'VIPPET50K',
    title: 'Giảm 50k Đặt Phòng Khách Sạn Thú Cưng VIP',
    discountType: 'fixed',
    value: 50000,
    validUntil: '2026-09-30',
    usageCount: 20,
    maxUsage: 50,
    targetSegment: 'Khách hàng VIP / Vàng',
    status: 'Hoạt động'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Lịch hẹn mới chờ duyệt',
    message: 'Khách hàng Nguyễn Văn An vừa đặt lịch Spa Poodle lúc 09:30',
    time: '5 phút trước',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-2',
    title: 'Cảnh báo tồn kho',
    message: 'Sản phẩm Pate Whiskas cá hồi chỉ còn 2 gói trong kho!',
    time: '30 phút trước',
    read: false,
    type: 'stock'
  },
  {
    id: 'notif-3',
    title: 'Sinh nhật thú cưng sắp tới',
    message: 'Bé Bông (Chủ: Trần Thị Mai) sẽ đón sinh nhật vào 3 ngày tới!',
    time: '1 giờ trước',
    read: true,
    type: 'crm'
  }
];
