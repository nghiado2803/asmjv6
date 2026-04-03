<template>
  <div class="login-container">
    <div class="login-wrapper border-gold-subtle shadow-lg">
      
      <div class="text-center mb-5">
        <h1 class="brand-text d-inline-block mb-4">WATCH<span class="gold-text">STORE</span></h1>
        <h2 class="login-title luxury-font text-uppercase letter-spacing-1 text-dark">Thành viên VIP</h2>
        <div class="divider-gold mx-auto mt-2 mb-3"></div>
        <p class="login-subtitle letter-spacing-1 small">Đăng nhập để khám phá đặc quyền của bạn</p>
      </div>

      <div v-if="errorMsg" class="alert custom-alert-danger mb-4 rounded-1 d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-3 fs-5"></i> 
        <span class="small fw-bold letter-spacing-1 text-uppercase">{{ errorMsg }}</span>
      </div>

      <button type="button" class="btn-google mb-4" @click="handleGoogleLogin">
        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" class="google-icon"/>
        <span class="fw-bold letter-spacing-1 small text-uppercase">Tiếp tục với Google</span>
      </button>

      <div class="divider d-flex align-items-center mb-4 opacity-75">
        <span class="line flex-grow-1 border-gold-subtle"></span>
        <span class="text-muted px-3 small text-uppercase fw-bold letter-spacing-1" style="font-size: 10px;">Hoặc sử dụng Email</span>
        <span class="line flex-grow-1 border-gold-subtle"></span>
      </div>

      <form @submit.prevent="handleLogin">
        
        <div class="mb-4 position-relative">
          <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Địa chỉ Email</label>
          <div class="input-group custom-input-group">
            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
            <input type="email" v-model="form.email" class="form-control" placeholder="Tên đăng nhập..." required :disabled="isLoading">
          </div>
        </div>
        
        <div class="mb-4 position-relative">
          <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Mật khẩu bảo mật</label>
          <div class="input-group custom-input-group">
            <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="form-control pe-5" placeholder="Nhập mật khẩu..." required :disabled="isLoading">
            <i class="bi position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer text-muted fs-5 eye-icon" 
               :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" 
               @click="showPassword = !showPassword" style="z-index: 10;"></i>
          </div>
        </div>

        <div class="d-flex justify-content-end mb-5">
          <router-link to="/forgot-password" class="forgot-link text-decoration-none small text-uppercase letter-spacing-1 fw-bold">Quên mật khẩu?</router-link>
        </div>

        <button class="btn-login w-100 text-uppercase letter-spacing-1 fw-bold mb-4 py-3 shadow-sm" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống' }}
        </button>
      </form>

      <div class="text-center pt-4 border-top border-gold-subtle opacity-75">
        <span class="text-muted small text-uppercase letter-spacing-1" style="font-size: 11px;">Chưa sở hữu tài khoản?</span><br>
        <router-link to="/register" class="register-link text-decoration-none fw-bold mt-2 d-inline-block text-uppercase letter-spacing-1">Đăng ký thành viên VIP</router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/index'; 

const router = useRouter();
const form = reactive({ email: '', password: '', remember: false });
const errorMsg = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';
  isLoading.value = true;

  try {
    const res = await api.post('/auth/login', {
      email: form.email,
      password: form.password
    });

    console.log("Đăng nhập thành công:", res.data);

    localStorage.setItem('token', res.data.token);
    
    const roleValue = res.data.role || (res.data.roles && res.data.roles[0]?.authority) || res.data.roles?.[0];
    localStorage.setItem('role', roleValue);
    
    localStorage.setItem('user', JSON.stringify(res.data.user || res.data));

    router.push('/').then(() => {
        window.location.reload();
    });

  } catch (error: any) {
    console.error("Lỗi đăng nhập:", error);
    if (error.response && error.response.status === 401) {
      errorMsg.value = "Sai email hoặc mật khẩu. Vui lòng thử lại!";
    } else {
      errorMsg.value = "Không thể kết nối đến máy chủ.";
    }
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY LOGIN
========================================== */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fdfbf7; /* Màu Kem Sữa Hoàng Gia */
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding: 2rem 1rem;
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png'); /* Pattern chìm tạo cảm giác cao cấp */
}

.luxury-font { font-family: 'Playfair Display', serif; }
.letter-spacing-1 { letter-spacing: 1px; }
.gold-text { color: #B38728 !important; }

/* Wrapper Form */
.login-wrapper {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  padding: 3.5rem 3rem;
  border-radius: 2px; /* Không bo góc tròn */
  border: 1px solid #f0e6d2;
}

/* Logo & Title */
.brand-text { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 2.2rem; color: #111; letter-spacing: 4px; }
.login-title { font-size: 1.5rem; }
.divider-gold { width: 50px; height: 2px; background: linear-gradient(to right, #B38728, #D4AF37, #B38728); }

/* Alerts */
.custom-alert-danger { background: #fff5f5; border: 1px solid #8b0000; border-left: 4px solid #8b0000; color: #8b0000; }

/* Nút Google */
.btn-google {
  display: flex; align-items: center; justify-content: center;
  width: 100%; padding: 14px; background: #fafafa;
  border: 1px solid #eaeaea; border-radius: 2px;
  color: #555; transition: all 0.3s ease; cursor: pointer;
}
.btn-google:hover { background: #fff; border-color: #D4AF37; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.1); color: #B38728; }
.google-icon { width: 22px; height: 22px; margin-right: 12px; }

/* Divider */
.border-gold-subtle { border-color: #eaeaea !important; }

/* Form Inputs */
.custom-input-group { border: 1px solid #e0e0e0; border-radius: 2px; transition: all 0.3s ease; background: #fafafa; }
.custom-input-group .input-group-text { background-color: transparent; border: none; color: #B38728; padding-right: 5px; }
.custom-input-group .form-control { border: none; background-color: transparent; box-shadow: none; padding: 12px 10px; font-size: 15px; color: #333; }
.custom-input-group:focus-within { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

.eye-icon { transition: color 0.2s; }
.eye-icon:hover { color: #B38728 !important; }
.cursor-pointer { cursor: pointer; }

/* Links */
.forgot-link { color: #888; transition: color 0.3s; }
.forgot-link:hover { color: #B38728; text-decoration: none !important; }

.register-link { color: #111; transition: all 0.3s; position: relative; }
.register-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: #D4AF37; transition: width 0.3s ease; }
.register-link:hover { color: #D4AF37; }
.register-link:hover::after { width: 100%; }

/* Nút Submit */
.btn-login {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111; border: 1px solid #D4AF37; border-radius: 2px;
  transition: all 0.4s ease;
}
.btn-login:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
}
.btn-login:disabled { background: #e0e0e0; border-color: #ccc; color: #888; cursor: not-allowed; box-shadow: none; }

/* Responsive */
@media (max-width: 576px) {
  .login-wrapper { padding: 2.5rem 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; }
}
</style>