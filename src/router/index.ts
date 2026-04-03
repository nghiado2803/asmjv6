import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/client/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==========================================
    // KHU VỰC KHÁCH HÀNG (CLIENT)
    // ==========================================
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/client/Products.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/client/ProductDetail.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/client/Cart.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/client/Checkout.vue')
    },
    
    // --- Xác thực & Tài khoản ---
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/client/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/client/Register.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      // ĐÃ FIX: Trỏ đúng vào thư mục client
      component: () => import('../views/client/ForgotPassword.vue') 
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/client/Profile.vue')
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('../views/client/ChangePassword.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/client/Orders.vue')
    },
    { 
      path: '/order/:id', 
      name: 'order-detail', 
      component: () => import('../views/client/OrderDetail.vue') 
    },

    // ==========================================
    // KHU VỰC QUẢN TRỊ (ADMIN)
    // ==========================================
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/Dashboard.vue')
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/admin/ManageProducts.vue')
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: () => import('../views/admin/ManageCategories.vue')
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../views/admin/ManageOrders.vue')
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/admin/ManageUsers.vue')
    },
    {
      path: '/admin/stats',
      name: 'admin-stats',
      component: () => import('../views/admin/Stats.vue')
    },
    {
      path: '/admin/chat',
      name: 'admin-chat',
      component: () => import('../views/admin/Chat.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Chỉnh lại Navigation Guard kiểu mới cho mượt, hết báo lỗi warn
router.beforeEach((to) => {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role.includes('ADMIN');
  const isAuthenticated = !!localStorage.getItem('user');
  
  // Nếu cố vào trang admin mà không có quyền admin
  if (to.path.startsWith('/admin') && !isAdmin) {
    return '/login'; 
  }
  
  // Bảo vệ các trang nhạy cảm của user: checkout, orders, order detail, profile
  const authRequiredRoutes = ['/checkout', '/orders', '/profile', '/change-password'];
  if ((authRequiredRoutes.includes(to.path) || to.path.startsWith('/order/')) && !isAuthenticated) {
    return '/login';
  }
});

export default router