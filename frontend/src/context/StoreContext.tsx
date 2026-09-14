import React, { createContext, useContext, useState } from 'react';
import { 
  Customer, 
  Pet, 
  Service, 
  Appointment, 
  Product, 
  Order, 
  Staff, 
  Promotion, 
  NotificationItem,
  AppointmentStatus,
  OrderStatus
} from '../types';
import { 
  initialCustomers, 
  initialPets, 
  initialServices, 
  initialProducts, 
  initialAppointments, 
  initialOrders, 
  initialStaff, 
  initialPromotions, 
  initialNotifications 
} from '../mock/seedData';

export interface UserSession {
  id: string;
  name: string;
  role: 'admin' | 'staff';
  email: string;
  phone: string;
  avatar: string;
}

interface StoreContextType {
  // Authentication & Internal RBAC
  currentUser: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: 'admin' | 'staff') => void;

  // Navigation active tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;

  // Search & Filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // State Entities
  customers: Customer[];
  pets: Pet[];
  services: Service[];
  products: Product[];
  appointments: Appointment[];
  orders: Order[];
  staff: Staff[];
  promotions: Promotion[];
  notifications: NotificationItem[];

  // Mutations
  addCustomer: (cust: Omit<Customer, 'id' | 'code' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addPet: (pet: Omit<Pet, 'id' | 'groomingHistoryCount' | 'stayHistoryCount' | 'medicalHistory'>) => Pet;
  updatePet: (id: string, pet: Partial<Pet>) => void;
  deletePet: (id: string) => void;

  addService: (svc: Omit<Service, 'id'>) => void;
  updateService: (id: string, svc: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceActive: (id: string) => void;

  addAppointment: (app: Omit<Appointment, 'id' | 'code'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointmentTime: (id: string, date: string, time: string) => void;
  assignAppointmentStaff: (id: string, staffId: string, staffName: string) => void;
  deleteAppointment: (id: string) => void;

  addProduct: (prod: Omit<Product, 'id' | 'sku' | 'status'>) => void;
  updateProductStock: (id: string, newStock: number) => void;
  adjustStock: (id: string, delta: number) => void;
  deleteProduct: (id: string) => void;

  addOrder: (order: Omit<Order, 'id' | 'code'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  addStaff: (st: Omit<Staff, 'id' | 'handledAppointments' | 'revenueGenerated'>) => void;
  updateStaff: (id: string, st: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, promo: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;

  markNotificationAsRead: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default Admin Session for immediate access demo, can logout to test Login screen
  const [currentUser, setCurrentUser] = useState<UserSession | null>({
    id: 'user-admin',
    name: 'Nguyễn Văn Minh (Quản lý)',
    role: 'admin',
    email: 'admin@petcare.com',
    phone: '0908888999',
    avatar: '',
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Entities state
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Authentication Handlers
  const login = (email: string, pass: string, role: string) => {
    if (role === 'customer') {
      return { success: false, message: 'Khách hàng không được phép truy cập vào phần mềm quản lý nội bộ!' };
    }

    if (role === 'admin') {
      setCurrentUser({
        id: 'user-admin',
        name: 'Nguyễn Văn Minh (Quản lý)',
        role: 'admin',
        email: email || 'admin@petcare.com',
        phone: '0908888999',
        avatar: '',
      });
      return { success: true };
    } else {
      setCurrentUser({
        id: 'user-staff',
        name: 'Trần Thị Thu Hà (Nhân viên)',
        role: 'staff',
        email: email || 'nhanvien@petcare.com',
        phone: '0912345678',
        avatar: '',
      });
      return { success: true };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: 'admin' | 'staff') => {
    if (!currentUser) return;
    if (newRole === 'admin') {
      setCurrentUser({
        ...currentUser,
        name: 'Nguyễn Văn Minh (Quản lý)',
        role: 'admin',
        email: 'admin@petcare.com',
      });
    } else {
      setCurrentUser({
        ...currentUser,
        name: 'Trần Thị Thu Hà (Nhân viên)',
        role: 'staff',
        email: 'staff@petcare.com',
      });
    }
  };

  // Customer Mutations
  const addCustomer = (data: Omit<Customer, 'id' | 'code' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      code: `KH-${1000 + customers.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Pet Mutations
  const addPet = (data: Omit<Pet, 'id' | 'groomingHistoryCount' | 'stayHistoryCount' | 'medicalHistory'>): Pet => {
    const newPet: Pet = {
      ...data,
      id: `pet-${Date.now()}`,
      groomingHistoryCount: 0,
      stayHistoryCount: 0,
      medicalHistory: []
    };
    setPets(prev => [newPet, ...prev]);
    return newPet;
  };

  const updatePet = (id: string, data: Partial<Pet>) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePet = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
  };

  // Service Mutations
  const addService = (data: Omit<Service, 'id'>) => {
    const newSvc: Service = {
      ...data,
      id: `svc-${Date.now()}`
    };
    setServices(prev => [newSvc, ...prev]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const toggleServiceActive = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = s.active !== undefined ? !s.active : !((s as any).isActive ?? true);
        return { ...s, active: nextState, isActive: nextState } as any;
      }
      return s;
    }));
  };

  // Appointment Mutations
  const addAppointment = (data: Omit<Appointment, 'id' | 'code'>) => {
    const newApp: Appointment = {
      ...data,
      id: `app-${Date.now()}`,
      code: `LH-${2000 + appointments.length + 1}`
    };
    setAppointments(prev => [newApp, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateAppointmentTime = (id: string, date: string, time: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date, time } : a));
  };

  const assignAppointmentStaff = (id: string, staffId: string, staffName: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, staffId, staffName } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Product Mutations
  const addProduct = (data: Omit<Product, 'id' | 'sku' | 'status'>) => {
    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      sku: `SKU-PET-${100 + products.length + 1}`,
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Order Mutations
  const addOrder = (data: Omit<Order, 'id' | 'code'>) => {
    const newOrd: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      code: `HD-${5000 + orders.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrd, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Staff Mutations
  const addStaff = (data: Omit<Staff, 'id' | 'handledAppointments' | 'revenueGenerated'>) => {
    const newSt: Staff = {
      ...data,
      id: `st-${Date.now()}`,
    };
    setStaff(prev => [newSt, ...prev]);
  };

  const updateStaff = (id: string, data: Partial<Staff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  // Promotion Mutations
  const addPromotion = (data: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...data,
      id: `promo-${Date.now()}`
    };
    setPromotions(prev => [newPromo, ...prev]);
  };

  const updatePromotion = (id: string, data: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // Notification Mutation
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      switchRole,
      activeTab,
      setActiveTab,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      isMobileDrawerOpen,
      setIsMobileDrawerOpen,
      globalSearch,
      setGlobalSearch,
      customers,
      pets,
      services,
      products,
      appointments,
      orders,
      staff,
      promotions,
      notifications,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addPet,
      updatePet,
      deletePet,
      addService,
      updateService,
      deleteService,
      toggleServiceActive,
      addAppointment,
      updateAppointmentStatus,
      updateAppointmentTime,
      assignAppointmentStaff,
      deleteAppointment,
      addProduct,
      updateProductStock,
      adjustStock,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      addStaff,
      updateStaff,
      deleteStaff,
      addPromotion,
      updatePromotion,
      deletePromotion,
      markNotificationAsRead
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
