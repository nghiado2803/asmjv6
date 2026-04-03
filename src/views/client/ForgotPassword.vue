<template>
  <div class="forgot-password-container">
    <div class="forgot-wrapper border-gold-subtle shadow-lg">
      
      <div class="text-center mb-5">
        <h1 class="brand-text d-inline-block mb-4">WATCH<span class="gold-text">STORE</span></h1>
        <h2 class="login-title luxury-font text-uppercase letter-spacing-1 text-dark">Khôi phục mật khẩu</h2>
        <div class="divider-gold mx-auto mt-2 mb-3"></div>
        <p class="login-subtitle letter-spacing-1 small">
          {{ step === 1 ? 'Vui lòng cung cấp email đã đăng ký để nhận mã xác thực OTP' : 'Xác thực mã OTP và thiết lập lại mật khẩu bảo mật' }}
        </p>
      </div>

      <div v-if="errorMsg" class="alert custom-alert-danger mb-4 rounded-1 d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-3 fs-5"></i> 
        <span class="small fw-bold letter-spacing-1 text-uppercase">{{ errorMsg }}</span>
      </div>
      <div v-if="successMsg" class="alert custom-alert-success mb-4 rounded-1 d-flex align-items-center">
        <i class="bi bi-check-circle-fill me-3 fs-5"></i> 
        <span class="small fw-bold letter-spacing-1 text-uppercase">{{ successMsg }}</span>
      </div>

      <form v-if="step === 1" @submit.prevent="requestOtp">
        <div class="mb-5 position-relative">
          <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Địa chỉ Email</label>
          <div class="input-group custom-input-group">
            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
            <input type="email" v-model="email" class="form-control" placeholder="Nhập email của quý khách..." required :disabled="isLoading">
          </div>
        </div>

        <button class="btn-gold w-100 text-uppercase letter-spacing-1 fw-bold mb-4 py-3 shadow-sm d-flex align-items-center justify-content-center" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <i v-else class="bi bi-send-fill me-2 fs-5"></i>
          <span>{{ isLoading ? 'Đang gửi mã bảo mật...' : 'Nhận Mã Xác Thực (OTP)' }}</span>
        </button>
      </form>

      <form v-else-if="step === 2" @submit.prevent="resetPassword">
        
        <div class="mb-4 text-center px-4">
          <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1 d-block mb-3">Mã OTP 6 số</label>
          <input type="text" v-model="form.otp" class="form-control otp-input text-center fw-bold letter-spacing-custom bg-light mx-auto" required maxlength="6" placeholder="· · · · · ·" :disabled="isLoading">
          <div class="form-text mt-3 small text-muted fst-italic letter-spacing-1" style="font-size: 11px;">Mã sẽ hết hạn sau 5 phút. Vui lòng kiểm tra cả hộp thư rác (Spam).</div>
        </div>

        <div class="mb-4 position-relative">
          <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Mật khẩu mới</label>
          <div class="input-group custom-input-group">
            <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
            <input type="password" v-model="form.newPassword" class="form-control" placeholder="Tối thiểu 6 ký tự..." required minlength="6" :disabled="isLoading">
          </div>
        </div>

        <div class="mb-5 position-relative">
          <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Xác nhận mật khẩu</label>
          <div class="input-group custom-input-group">
            <span class="input-group-text"><i class="bi bi-check-all fs-5"></i></span>
            <input type="password" v-model="form.confirmPassword" class="form-control" placeholder="Nhập lại mật khẩu mới..." required :disabled="isLoading" autocomplete="one-time-code">
          </div>
        </div>

        <button class="btn-gold w-100 text-uppercase letter-spacing-1 fw-bold mb-4 py-3 shadow-sm d-flex align-items-center justify-content-center" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <i v-else class="bi bi-shield-check me-2 fs-5"></i>
          <span>{{ isLoading ? 'Đang mã hóa dữ liệu...' : 'Cập Nhật Mật Khẩu' }}</span>
        </button>
      </form>

      <div class="text-center pt-4 border-top border-gold-subtle opacity-75">
        <router-link to="/login" class="back-link text-decoration-none small text-uppercase letter-spacing-1 fw-bold text-muted">
          <i class="bi bi-arrow-left me-1"></i> Trở về trang Đăng nhập
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/index';

const router = useRouter();

const step = ref(1);
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const email = ref('');
const form = reactive({
  otp: '',
  newPassword: '',
  confirmPassword: ''
});

// BƯỚC 1: Gửi yêu cầu lấy OTP
const requestOtp = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  isLoading.value = true;

  try {
    await api.post('/auth/forgot-password', { email: email.value });
    step.value = 2;
    successMsg.value = 'Mã bảo mật OTP đã được gửi thành công.';
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMsg.value = error.response.data.error;
    } else {
      errorMsg.value = 'Lỗi kết nối đến máy chủ.';
    }
  } finally {
    isLoading.value = false;
  }
};

// BƯỚC 2: Cập nhật mật khẩu mới
const resetPassword = async () => {
  errorMsg.value = '';
  successMsg.value = '';

  if (form.newPassword !== form.confirmPassword) {
    errorMsg.value = 'Mật khẩu xác nhận không trùng khớp!';
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      email: email.value,
      otp: form.otp,
      newPassword: form.newPassword
    };

    const res = await api.post('/auth/reset-password', payload);
    
    successMsg.value = res.data.message || 'Thiết lập mật khẩu thành công!';
    
    // Đổi pass xong, đẩy về Login sau 2 giây
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMsg.value = error.response.data.error;
    } else {
      errorMsg.value = 'Mã OTP không hợp lệ hoặc đã hết hạn.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY FORGOT PASSWORD
========================================== */
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fdfbf7; /* Màu Kem Sữa Hoàng Gia */
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding: 2rem 1rem;
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
}

.luxury-font { font-family: 'Playfair Display', serif; }
.letter-spacing-1 { letter-spacing: 1px; }
.gold-text { color: #B38728 !important; }

/* Wrapper Form */
.forgot-wrapper {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  padding: 3.5rem 3rem;
  border-radius: 2px; /* Không bo góc tròn */
  border: 1px solid #f0e6d2;
}

/* Logo & Title */
.brand-text { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 2.2rem; color: #111; letter-spacing: 4px; }
.login-title { font-size: 1.4rem; }
.divider-gold { width: 50px; height: 2px; background: linear-gradient(to right, #B38728, #D4AF37, #B38728); }

/* Alerts */
.custom-alert-danger { background: #fff5f5; border: 1px solid #8b0000; border-left: 4px solid #8b0000; color: #8b0000; }
.custom-alert-success { background: #fdfbf7; border: 1px solid #D4AF37; border-left: 4px solid #D4AF37; color: #B38728; }

/* Form Inputs */
.custom-input-group { border: 1px solid #e0e0e0; border-radius: 2px; transition: all 0.3s ease; background: #fafafa; }
.custom-input-group .input-group-text { background-color: transparent; border: none; color: #B38728; padding-right: 5px; }
.custom-input-group .form-control { border: none; background-color: transparent; box-shadow: none; padding: 12px 10px; font-size: 15px; color: #333; }
.custom-input-group:focus-within { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

/* Inputs OTP (Step 2) */
.otp-input {
  border: 2px solid #e0e0e0;
  border-radius: 2px;
  font-size: 28px;
  padding: 15px;
  transition: all 0.3s ease;
  color: #111;
  max-width: 250px;
}
.otp-input:focus { border-color: #D4AF37; background: #fff !important; box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); outline: none; }
.letter-spacing-custom { letter-spacing: 0.5em; }

/* Links */
.back-link { transition: color 0.3s; }
.back-link:hover { color: #B38728 !important; }

/* Nút Submit */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111; border: 1px solid #D4AF37; border-radius: 2px;
  transition: all 0.4s ease; border: none;
}
.btn-gold:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
}
.btn-gold:disabled { opacity: 0.7; filter: grayscale(50%); cursor: not-allowed; box-shadow: none; }

/* Responsive */
@media (max-width: 576px) {
  .forgot-wrapper { padding: 2.5rem 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; }
}
</style>