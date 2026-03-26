<template>
  <div class="login-container">
    <div class="login-image-side">
      <div class="login-quote" data-aos="fade-up">
        <h1 class="quote-text">"Thời gian là thứ duy nhất không thể lấy lại."</h1>
        <p class="fs-5 text-white-50">- WatchStore Collection -</p>
      </div>
    </div>

    <div class="login-form-side">
      <div class="login-wrapper">
        <div class="mb-4 text-center">
          <h2 class="login-title">Chào mừng trở lại</h2>
          <p class="login-subtitle">Đăng nhập để trải nghiệm đặc quyền VIP.</p>
        </div>

        <div class="divider d-flex align-items-center mb-4">
          <span class="line flex-grow-1"></span>
          <span class="text-muted px-3 small text-uppercase">Hoặc đăng nhập bằng Email</span>
          <span class="line flex-grow-1"></span>
        </div>

        <div v-if="errorMsg" class="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-4 shadow-sm rounded-3">
          <i class="bi bi-exclamation-circle-fill me-2"></i> {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-floating mb-3">
            <input type="email" v-model="form.email" class="form-control" id="user" placeholder="name@example.com" required :disabled="isLoading">
            <label for="user"><i class="bi bi-envelope me-2"></i>Email của bạn</label>
          </div>
          
          <div class="form-floating mb-4 position-relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="form-control" id="pass" placeholder="Mật khẩu" required :disabled="isLoading">
            <label for="pass"><i class="bi bi-lock me-2"></i>Mật khẩu</label>
            <i class="bi position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer text-muted" 
               :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" 
               @click="showPassword = !showPassword"></i>
          </div>
           <button type="button" class="btn-google mb-4 shadow-sm" @click="handleGoogleLogin">
          <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" class="me-2"/>
          Tiếp tục với Google
        </button>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
              <input class="form-check-input shadow-none cursor-pointer" type="checkbox" v-model="form.remember" id="remember">
              <label class="form-check-label text-muted small cursor-pointer" for="remember">Ghi nhớ tôi</label>
            </div>
            <router-link to="/forgot-password" class="text-decoration-none small text-primary fw-bold hover-underline">Quên mật khẩu?</router-link>
          </div>

          <button class="btn-login shadow" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Đang xác thực...' : 'Đăng nhập' }}
          </button>
        </form>
        

        <div class="text-center mt-5">
          <span class="text-muted small">Bạn chưa có tài khoản?</span>
          <router-link to="/register" class="text-decoration-none fw-bold ms-1 text-danger hover-underline">Đăng ký ngay</router-link>
        </div>
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
    // 1. Gọi API Backend (Spring Boot)
    const res = await api.post('/auth/login', {
      email: form.email,
      password: form.password
    });

    console.log("Đăng nhập thành công:", res.data);

    // 2. Lưu trữ Token và Role để Header/Router sử dụng
    localStorage.setItem('token', res.data.token);
    
    // Lưu Role (Hỗ trợ cả dạng mảng roles hoặc chuỗi role đơn lẻ)
    const roleValue = res.data.role || (res.data.roles && res.data.roles[0]?.authority) || res.data.roles?.[0];
    localStorage.setItem('role', roleValue);
    
    // Lưu thông tin user để hiển thị tên trên Header
    localStorage.setItem('user', JSON.stringify(res.data.user || res.data));

    // 3. ĐIỀU HƯỚNG: Luôn về trang chủ (Home) theo yêu cầu của mày
    // Không phân biệt Admin hay User ở đây
    router.push('/').then(() => {
        // Reload nhẹ để Header nhận diện lại role trong localStorage
        window.location.reload();
    });

  } catch (error: any) {
    console.error("Lỗi đăng nhập:", error);
    if (error.response && error.response.status === 401) {
      errorMsg.value = "Sai email hoặc mật khẩu. Vui lòng thử lại!";
    } else {
      errorMsg.value = "Không thể kết nối đến máy chủ. Kiểm tra IntelliJ!";
    }
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  alert("Chức năng Đăng nhập Google đang được tích hợp!");
};
</script>

<style scoped>
/* Reset & Layout */
.login-container { min-height: 100vh; display: flex; margin-top: -80px; font-family: 'Inter', sans-serif;}
.cursor-pointer { cursor: pointer; }

/* Image Side */
.login-image-side { background: url('https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop') center/cover no-repeat; position: relative; flex: 1.2; display: flex; align-items: center; justify-content: center; color: white; }
.login-image-side::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.4) 100%); }
.login-quote { position: relative; z-index: 2; text-align: center; padding: 2rem; max-width: 80%; }
.quote-text { font-family: 'Playfair Display', serif; font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.3; text-shadow: 0 10px 20px rgba(0,0,0,0.5); font-weight: 700;}

/* Form Side */
.login-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem; background: #fff; max-width: 550px; }
.login-wrapper { width: 100%; max-width: 420px; }
.login-title { font-size: 2.2rem; font-weight: 800; color: #111; letter-spacing: -1px; }
.login-subtitle { color: #666; font-size: 1.1rem; }

/* Google Button */
.btn-google { display: flex; align-items: center; justify-content: center; width: 100%; padding: 12px; background: #fff; border: 1px solid #ddd; border-radius: 8px; font-weight: 600; color: #333; transition: all 0.3s ease; }
.btn-google:hover { background: #f8f9fa; border-color: #ccc; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

/* Divider */
.divider .line { height: 1px; background-color: #eee; }

/* Inputs */
.form-floating > .form-control { border: 2px solid transparent; border-bottom: 2px solid #ddd; border-radius: 0; padding-left: 0; padding-right: 40px; box-shadow: none !important; background: transparent; transition: all 0.3s; font-weight: 500;}
.form-floating > .form-control:focus { border-bottom-color: #d0021b; }
.form-floating > label { padding-left: 0; color: #888; transition: all 0.3s; }
.form-floating > .form-control:focus ~ label, .form-floating > .form-control:not(:placeholder-shown) ~ label { color: #d0021b; font-weight: 600; }

/* Main Button */
.btn-login { background: #111; color: #fff; height: 55px; border-radius: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; width: 100%; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.btn-login:hover:not(:disabled) { background: #d0021b; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(208, 2, 27, 0.3) !important; }
.btn-login:disabled { background: #ccc; cursor: not-allowed; }

.hover-underline:hover { text-decoration: underline !important; }

/* Responsive */
@media (max-width: 992px) { 
  .login-image-side { display: none; } 
  .login-form-side { max-width: 100%; padding: 2rem; } 
}
</style>