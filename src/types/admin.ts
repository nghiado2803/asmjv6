export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER';
  enabled: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  fullName: string;
  phoneNumber: string;
  orderDate: string;
  totalPrice: number;
  status: 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  paymentMethod: string;
  paymentStatus: string;
}

export interface AdminStats {
  totalRevenue: number;
  newOrdersCount: number;
  newCustomersCount: number;
  chartData: number[];
  topProducts: any[];
  recentOrders: Order[];
}
export interface Product {
  id?: number;
  name: string;
  code?: string;
  price: number;
  stock: number;
  brand: string;
  imageUrl?: string;
  categoryName?: string;
  categoryId?: number;
}