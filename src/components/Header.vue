<template>
  <div>
    <div v-if="isAuthenticated && isAdmin && isAdminRoute" 
         class="d-flex flex-column flex-shrink-0 p-3 admin-sidebar shadow-lg" 
         style="width: 280px; position: fixed; top: 0; bottom: 0; left: 0; z-index: 1050;">
        <router-link to="/admin/dashboard" class="d-flex align-items-center mb-4 text-white text-decoration-none px-2 mt-2">
            <i class="bi bi-watch-fill fs-2 me-3 gold-text"></i>
            <span class="fs-5 fw-bold luxury-font letter-spacing-1 text-uppercase">Quản trị viên</span>
        </router-link>
        <hr class="border-secondary mb-4 opacity-25">
        <ul class="nav nav-pills flex-column mb-auto admin-nav">
            <li class="nav-item"><router-link to="/admin/dashboard" class="nav-link px-3" active-class="active"><i class="bi bi-grid-fill me-3"></i> <span>Tổng quan</span></router-link></li>
            <li><router-link to="/admin/products" class="nav-link px-3" active-class="active"><i class="bi bi-box-seam-fill me-3"></i> <span>Sản phẩm</span></router-link></li>
            <li><router-link to="/admin/categories" class="nav-link px-3" active-class="active"><i class="bi bi-tags-fill me-3"></i> <span>Danh mục</span></router-link></li>
            <li><router-link to="/admin/users" class="nav-link px-3" active-class="active"><i class="bi bi-people-fill me-3"></i> <span>Người dùng</span></router-link></li>
            <li><router-link to="/admin/orders" class="nav-link px-3" active-class="active"><i class="bi bi-cart-check-fill me-3"></i> <span>Đơn hàng</span></router-link></li>
            <li><router-link to="/admin/chat" class="nav-link px-3" active-class="active"><i class="bi bi-chat-dots-fill me-3"></i> <span>Tư vấn khách hàng</span></router-link></li>
            <li><router-link to="/admin/stats" class="nav-link px-3" active-class="active"><i class="bi bi-bar-chart-fill me-3"></i> <span>Thống kê</span></router-link></li>
            
            <li class="mt-5 pt-4 border-top border-secondary opacity-75">
                <router-link to="/" class="nav-link px-3 gold-text fw-bold"><i class="bi bi-box-arrow-up-right me-3"></i> Xem Website</router-link>
            </li>
        </ul>
    </div>

    <nav v-if="!isAdminRoute" class="navbar navbar-expand-lg navbar-luxury fixed-top shadow-sm">
        <div class="container">
            <router-link class="brand-text" to="/">WATCH<span class="gold-text">STORE</span></router-link>
            
            <button class="navbar-toggler border-0 shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                <i class="bi bi-list fs-1"></i>
            </button>

            <div class="collapse navbar-collapse" id="navbarMain">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 mt-3 mt-lg-0">
                    <li class="nav-item"><router-link class="nav-link nav-link-luxury" to="/" active-class="active">Trang chủ</router-link></li>
                    <li class="nav-item"><router-link class="nav-link nav-link-luxury" to="/products" active-class="active">Bộ sưu tập</router-link></li>
                    <li class="nav-item"><router-link class="nav-link nav-link-luxury" to="/cart" active-class="active">Giỏ hàng</router-link></li>
                    <li class="nav-item"><a class="nav-link nav-link-luxury" href="#footer-contact">Liên hệ</a></li>
                </ul>

                <div class="d-flex align-items-center mt-3 mt-lg-0 pb-3 pb-lg-0">
                    <router-link to="/products" class="action-icon"><i class="bi bi-search"></i></router-link>
                    <router-link v-if="isAuthenticated" to="/orders" class="action-icon"><i class="bi bi-receipt"></i></router-link>

                    <router-link to="/cart" class="action-icon position-relative">
                        <i class="bi bi-bag"></i>
                        <span class="cart-badge">{{ cartStore.totalQuantity }}</span>
                    </router-link>

                    <div class="ms-4 border-start border-gold-subtle ps-4 d-flex align-items-center">
                        <div v-if="!isAuthenticated">
                            <router-link to="/login" class="text-decoration-none text-dark fw-bold small text-uppercase letter-spacing-1 hover-gold">Đăng nhập</router-link>
                            <span class="text-muted mx-2 fw-light">/</span>
                            <router-link to="/register" class="text-decoration-none text-dark fw-bold small text-uppercase letter-spacing-1 hover-gold">Đăng ký</router-link>
                        </div>

                        <div v-else class="dropdown">
                            <a class="action-icon dropdown-toggle d-flex align-items-center text-decoration-none m-0" 
                               href="javascript:void(0)" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle fs-4"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-luxury" aria-labelledby="userDropdown">
                                <li><h6 class="dropdown-header text-uppercase gold-text small letter-spacing-1 fw-bold border-bottom pb-2 mb-2">Xin chào, {{ currentUser }}</h6></li>
                                <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person me-2 text-muted"></i> Hồ sơ cá nhân</router-link></li>
                                <li><router-link class="dropdown-item" to="/orders"><i class="bi bi-clock-history me-2 text-muted"></i> Lịch sử giao dịch</router-link></li>
                                
                                <li v-if="isAdmin">
                                  <hr class="dropdown-divider">
                                  <router-link class="dropdown-item gold-text fw-bold bg-light" to="/admin/dashboard"><i class="bi bi-shield-lock-fill me-2"></i> Quản trị hệ thống</router-link>
                                </li>
                                
                                <li><hr class="dropdown-divider mt-2 mb-2"></li>
                                <li>
                                  <button @click="logout" class="dropdown-item text-danger fw-bold border-0 bg-transparent w-100 text-start hover-danger">
                                    <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                                  </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
// @ts-ignore
import { Dropdown } from 'bootstrap'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const isAuthenticated = ref(false)
const isAdmin = ref(false)
const currentUser = ref('Khách hàng')
const currentLang = ref(localStorage.getItem('lang') || 'vi')

const initDropdowns = () => {
  const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
  dropdownElementList.map((dropdownToggleEl) => {
    return new Dropdown(dropdownToggleEl)
  })
}

const checkAuth = () => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (token) {
    isAuthenticated.value = true
    isAdmin.value = (role === 'ROLE_ADMIN' || role === 'ADMIN')
    currentUser.value = user.fullName || 'Thành viên'
  } else {
    isAuthenticated.value = false
    isAdmin.value = false
  }
}

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const changeLanguage = (lang: string) => {
  currentLang.value = lang
  localStorage.setItem('lang', lang)
  window.location.reload()
}

const logout = () => {
  localStorage.clear()
  isAuthenticated.value = false
  isAdmin.value = false
  cartStore.clearCart();
  router.push('/login')
}

watch([isAuthenticated, isAdminRoute], async () => {
  await nextTick()
  initDropdowns()
})

onMounted(async () => {
  checkAuth()
  await nextTick()
  initDropdowns()
})
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY NAVBAR & ADMIN SIDEBAR
========================================== */
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.hover-gold { transition: color 0.3s ease; }
.hover-gold:hover { color: #D4AF37 !important; }
.text-danger { color: #8b0000 !important; }

/* ---------------------------------
   ADMIN SIDEBAR - DARK LUXURY MODE
--------------------------------- */
.admin-sidebar { 
  background: #0a0a0a; /* Đen nhám sâu thẳm */
  color: #e0e0e0; 
  min-height: 100vh; 
  border-right: 1px solid #222;
}
.admin-nav .nav-link { 
  color: #888; 
  border-radius: 2px; /* Vuông vức sắc cạnh */
  margin-bottom: 0.5rem; 
  padding: 12px 15px !important;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}
.admin-nav .nav-link:hover { color: #D4AF37; background: #1a1a1a; }
.admin-nav .nav-link.active { 
  background: linear-gradient(90deg, #1a1a1a, transparent) !important; 
  color: #D4AF37 !important; 
  border-left: 3px solid #D4AF37;
  font-weight: 700;
}

/* ---------------------------------
   CUSTOMER NAVBAR - WHITE & GOLD
--------------------------------- */
.navbar-luxury { 
  background: rgba(255, 255, 255, 0.98); 
  backdrop-filter: blur(10px); 
  border-bottom: 1px solid #eaeaea; 
  padding: 18px 0; 
  z-index: 1060; 
  transition: all 0.3s ease;
}

.brand-text { 
  font-family: 'Montserrat', sans-serif;
  font-weight: 800; 
  font-size: 1.8rem; 
  color: #111; 
  text-decoration: none; 
  letter-spacing: 3px; 
}
.brand-text span { color: #D4AF37; }

/* Main Menu Links */
.nav-link-luxury { 
  font-size: 13px; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 1.5px; 
  color: #444 !important; 
  padding: 8px 18px !important; 
  margin: 0 5px;
  position: relative; 
  transition: color 0.3s ease;
}
.nav-link-luxury.active, .nav-link-luxury:hover { color: #B38728 !important; }

/* Hiệu ứng gạch chân vàng tinh tế khi Hover/Active */
.nav-link-luxury::after { 
  content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
  width: 0; height: 2px; background: #D4AF37; transition: width 0.3s ease; 
}
.nav-link-luxury:hover::after, .nav-link-luxury.active::after { width: 25px; }

/* Action Icons (Search, Cart, User) */
.action-icon { 
  font-size: 1.3rem; 
  color: #222; 
  margin-left: 22px; 
  position: relative; 
  text-decoration: none; 
  transition: color 0.3s ease; 
}
.action-icon:hover { color: #B38728; }

/* Cart Badge */
.cart-badge { 
  position: absolute; top: -6px; right: -10px; 
  background: linear-gradient(135deg, #D4AF37, #B38728); 
  color: #fff; font-size: 10px; font-weight: 800; 
  width: 18px; height: 18px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  box-shadow: 0 2px 5px rgba(212, 175, 55, 0.4); 
}

/* User Dropdown */
.dropdown-menu-luxury { 
  border: 1px solid #eaeaea; 
  border-radius: 2px; /* Không bo tròn góc */
  box-shadow: 0 15px 35px rgba(0,0,0,0.06); 
  margin-top: 25px !important; 
  padding: 10px 0; 
  min-width: 240px; 
}
.dropdown-menu-luxury .dropdown-item { 
  font-size: 14px; 
  padding: 12px 25px; 
  font-weight: 500; 
  transition: all 0.2s ease; 
  color: #333; 
}
.dropdown-menu-luxury .dropdown-item:hover { 
  background: #fdfbf7; 
  color: #B38728; 
  padding-left: 30px; /* Trượt nhẹ sang phải khi hover */
}
.dropdown-divider { border-top: 1px solid #f0f0f0; margin: 5px 0; }

.hover-danger { transition: all 0.2s ease; }
.hover-danger:hover { background-color: #fff5f5 !important; color: #8b0000 !important; padding-left: 30px; }
</style>