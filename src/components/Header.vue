<template>
  <div>
    <div v-if="isAuthenticated && isAdmin && isAdminRoute" 
         class="d-flex flex-column flex-shrink-0 p-3 admin-sidebar shadow" 
         style="width: 280px; position: fixed; top: 0; bottom: 0; left: 0; z-index: 1050;">
        <router-link to="/admin/dashboard" class="d-flex align-items-center mb-4 text-white text-decoration-none px-2">
            <i class="bi bi-watch-fill fs-3 me-2 text-primary"></i>
            <span class="fs-5 fw-bold">Quản trị viên</span>
        </router-link>
        <hr class="border-secondary mb-4">
        <ul class="nav nav-pills flex-column mb-auto">
    <li class="nav-item"><router-link to="/admin/dashboard" class="nav-link px-3" active-class="active"><i class="bi bi-grid-fill me-2"></i> <span>Tổng quan</span></router-link></li>
    <li><router-link to="/admin/products" class="nav-link px-3" active-class="active"><i class="bi bi-box-seam-fill me-2"></i> <span>Sản phẩm</span></router-link></li>
    <li><router-link to="/admin/categories" class="nav-link px-3" active-class="active"><i class="bi bi-tags-fill me-2"></i> <span>Danh mục</span></router-link></li>
    <li><router-link to="/admin/users" class="nav-link px-3" active-class="active"><i class="bi bi-people-fill me-2"></i> <span>Người dùng</span></router-link></li>
    <li><router-link to="/admin/orders" class="nav-link px-3" active-class="active"><i class="bi bi-cart-check-fill me-2"></i> <span>Đơn hàng</span></router-link></li>
    <li><router-link to="/admin/chat" class="nav-link px-3" active-class="active"><i class="bi bi-chat-dots-fill me-2"></i> <span>Tư vấn khách hàng</span></router-link></li>
    
    <li><router-link to="/admin/stats" class="nav-link px-3" active-class="active"><i class="bi bi-bar-chart-fill me-2"></i> <span>Thống kê</span></router-link></li>
    
    <li class="mt-5 pt-3 border-top border-secondary">
        <router-link to="/" class="nav-link px-3 text-warning"><i class="bi bi-box-arrow-up-right me-2"></i> Website</router-link>
    </li>
</ul>
    </div>

    <nav v-if="!isAdminRoute" class="navbar navbar-expand-lg navbar-luxury fixed-top shadow-sm">
        <div class="container">
            <router-link class="brand-text" to="/">WATCH<span>STORE</span></router-link>
            
            <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarMain">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item"><router-link class="nav-link nav-link-luxury" to="/" active-class="active">Trang chủ</router-link></li>
                    <li class="nav-item"><router-link class="nav-link nav-link-luxury" to="/products" active-class="active">Sản phẩm</router-link></li>
                    <li class="nav-item"><router-link class="nav-link nav-link-luxury" to="/cart" active-class="active">Giỏ hàng</router-link></li>
                    <li class="nav-item"><a class="nav-link nav-link-luxury" href="#footer-contact">Liên hệ</a></li>
                </ul>

                <div class="d-flex align-items-center">
                    <router-link to="/products" class="action-icon"><i class="bi bi-search"></i></router-link>
                    <router-link v-if="isAuthenticated" to="/orders" class="action-icon"><i class="bi bi-receipt"></i></router-link>

                    <router-link to="/cart" class="action-icon position-relative">
                        <i class="bi bi-bag"></i>
                        <span class="cart-badge">{{ cartCount }}</span>
                    </router-link>

                    <div class="ms-3 border-end pe-3">
                        <div v-if="!isAuthenticated">
                            <router-link to="/login" class="text-decoration-none text-dark fw-bold small ms-2 hover-red">Đăng nhập</router-link>
                            <span class="text-muted mx-1">/</span>
                            <router-link to="/register" class="text-decoration-none text-dark fw-bold small hover-red">Đăng ký</router-link>
                        </div>

                        <div v-else class="dropdown">
                            <a class="action-icon dropdown-toggle d-flex align-items-center text-decoration-none" 
                               href="javascript:void(0)" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle fs-5"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-luxury shadow" aria-labelledby="userDropdown">
                                <li><h6 class="dropdown-header text-uppercase text-muted small">{{ currentUser }}</h6></li>
                                <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person me-2"></i> Hồ sơ</router-link></li>
                                <li><router-link class="dropdown-item" to="/orders"><i class="bi bi-receipt me-2"></i> Đơn hàng</router-link></li>
                                <li v-if="isAdmin"><hr class="dropdown-divider"><router-link class="dropdown-item text-primary fw-bold" to="/admin/dashboard">Admin</router-link></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><button @click="logout" class="dropdown-item text-danger border-0 bg-transparent w-100 text-start"><i class="bi bi-box-arrow-right me-2"></i> Đăng xuất</button></li>
                            </ul>
                        </div>
                    </div>

                    <div class="dropdown ms-3">
                        <a class="action-icon text-muted small text-decoration-none dropdown-toggle" 
                           href="javascript:void(0)" id="langDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-globe2 me-1"></i>
                            <span>{{ currentLang.toUpperCase() }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-luxury" aria-labelledby="langDropdown" style="min-width: 100px;">
                            <li><button class="dropdown-item d-flex align-items-center bg-transparent border-0 w-100" @click="changeLanguage('vi')">
                                <img src="https://flagcdn.com/w20/vn.png" class="me-2" style="width: 20px;"> Tiếng Việt
                            </button></li>
                            <li><button class="dropdown-item d-flex align-items-center bg-transparent border-0 w-100" @click="changeLanguage('en')">
                                <img src="https://flagcdn.com/w20/us.png" class="me-2" style="width: 20px;"> English
                            </button></li>
                        </ul>
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
// @ts-ignore
import { Dropdown } from 'bootstrap'

const route = useRoute()
const router = useRouter()

const isAuthenticated = ref(false)
const isAdmin = ref(false)
const currentUser = ref('Khách hàng')
const cartCount = ref(0)
const currentLang = ref(localStorage.getItem('lang') || 'vi')

// Hàm khởi tạo lại Dropdown cho Bootstrap
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
    isAdmin.value = (role === 'ROLE_ADMIN')
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
  router.push('/login')
}

// Quan trọng: Mỗi khi Auth thay đổi (v-if đổi), phải đợi Vue render xong rồi mới init lại Dropdown
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
/* Toàn bộ CSS Luxury của mày giữ nguyên */
.admin-sidebar { background: #1e293b; color: #fff; min-height: 100vh; box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
.admin-sidebar .nav-link { color: #94a3b8; border-radius: 0.5rem; margin-bottom: 0.25rem; }
.admin-sidebar .nav-link.active { background: #3b82f6 !important; color: #fff !important; }
.navbar-luxury { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); padding: 15px 0; z-index: 1060; }
.brand-text { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.5rem; color: #1a1a1a; text-decoration: none; }
.brand-text span { color: #d0021b; }
.nav-link-luxury { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #555 !important; padding: 0 15px !important; position: relative; }
.nav-link-luxury.active, .nav-link-luxury:hover { color: #d0021b !important; }
.action-icon { font-size: 1.2rem; color: #333; margin-left: 15px; position: relative; text-decoration: none; }
.cart-badge { position: absolute; top: -5px; right: -8px; background: #d0021b; color: white; font-size: 0.6rem; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.dropdown-menu-luxury { border: none; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-top: 15px; }
.hover-red:hover { color: #d0021b !important; }
</style>