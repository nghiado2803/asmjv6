<template>
  <div class="register-container">
    <div class="register-wrapper border-gold-subtle shadow-lg">
      
      <div v-if="step === 1">
        <div class="text-center mb-5">
          <h1 class="brand-text d-inline-block mb-4">WATCH<span class="gold-text">STORE</span></h1>
          <h2 class="login-title luxury-font text-uppercase letter-spacing-1 text-dark">Thẻ Thành Viên</h2>
          <div class="divider-gold mx-auto mt-2 mb-3"></div>
          <p class="login-subtitle letter-spacing-1 small">Mở khóa đặc quyền dành riêng cho khách hàng VIP</p>
        </div>
        <form @submit.prevent="submitRegister">
          <div class="mb-4 position-relative">
            <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Họ và tên</label>
            <div class="input-group custom-input-group">
              <span class="input-group-text"><i class="bi bi-person-vcard"></i></span>
              <input type="text" v-model="form.fullName" class="form-control" placeholder="Tên đầy đủ của quý khách..." required :disabled="isLoading">
            </div>
          </div>

          <div class="mb-4 position-relative">
            <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Địa chỉ Email</label>
            <div class="input-group custom-input-group">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input type="email" v-model="form.email" class="form-control" placeholder="email@domain.com" required :disabled="isLoading">
            </div>
          </div>

          <div class="mb-5 position-relative">
            <label class="form-label fw-bold text-muted text-uppercase letter-spacing-1 small mb-2 d-block">Mật khẩu bảo mật</label>
            <div class="input-group custom-input-group">
              <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
              <input type="password" v-model="form.password" class="form-control" required minlength="6" placeholder="Tối thiểu 6 ký tự..." :disabled="isLoading">
            </div>
            <div class="form-text small text-muted mt-2 fst-italic letter-spacing-1" style="font-size: 11px;">
              <i class="bi bi-info-circle gold-text me-1"></i> Khuyến nghị sử dụng chữ hoa, số và ký tự đặc biệt.
            </div>
          </div>
          
          <button type="submit" class="btn-gold w-100 text-uppercase letter-spacing-1 fw-bold mb-4 py-3 shadow-sm d-flex align-items-center justify-content-center" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <i v-else class="bi bi-person-plus-fill me-2 fs-5"></i>
            <span>{{ isLoading ? 'Đang mã hóa dữ liệu...' : 'Khởi tạo Hồ sơ VIP' }}</span>
          </button>
        </form>
        
        <div class="text-center pt-4 border-top border-gold-subtle opacity-75">
          <span class="text-muted small text-uppercase letter-spacing-1" style="font-size: 11px;">Đã sở hữu tài khoản?</span><br>
          <router-link to="/login" class="register-link text-decoration-none fw-bold mt-2 d-inline-block text-uppercase letter-spacing-1">Đăng nhập hệ thống</router-link>
        </div>
      </div>

      <div v-else-if="step === 2">
        <div class="text-center mb-5">
          <div class="icon-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm">
            <i class="bi bi-envelope-paper-heart gold-text display-4"></i>
          </div>
          <h2 class="login-title luxury-font text-uppercase letter-spacing-1 text-dark mb-3">Xác thực danh tính</h2>
          <p class="text-muted small letter-spacing-1 lh-lg">Mã bảo mật OTP đã được gửi đến email:<br><strong class="text-dark border-bottom border-gold-subtle pb-1">{{ form.email }}</strong></p>
        </div>

        <form @submit.prevent="submitVerify">
          <div class="mb-5 text-center px-4">
            <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1 d-block mb-3">Mã OTP 6 số</label>
            <input type="text" v-model="otpCode" class="form-control otp-input text-center fw-bold letter-spacing-custom bg-light mx-auto" required maxlength="6" placeholder="· · · · · ·" :disabled="isLoading">
            <div class="form-text mt-3 small text-muted fst-italic letter-spacing-1" style="font-size: 11px;">Mã sẽ hết hạn sau 5 phút. Vui lòng kiểm tra cả hộp thư rác (Spam).</div>
          </div>
          
          <button type="submit" class="btn-gold w-100 text-uppercase letter-spacing-1 fw-bold mb-4 py-3 shadow-sm d-flex align-items-center justify-content-center" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <i v-else class="bi bi-shield-check me-2 fs-5"></i>
            <span>{{ isLoading ? 'Đang đối chiếu...' : 'Xác Nhận & Đăng Nhập' }}</span>
          </button>
        </form>

        <div class="text-center pt-4 border-top border-gold-subtle opacity-75">
          <button @click="step = 1" class="btn btn-link text-muted text-decoration-none small text-uppercase letter-spacing-1 hover-gold" :disabled="isLoading">
            <i class="bi bi-arrow-left me-2"></i> Trở lại sửa Email
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/index'; 
import Swal from 'sweetalert2'; // Import SweetAlert2

const router = useRouter();

const step = ref(1); 
const isLoading = ref(false);

const form = reactive({
  fullName: '',
  email: '',
  password: ''
});

const otpCode = ref('');

// Cấu hình Swal theo chuẩn Luxury
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

// BƯỚC 1: Xử lý Đăng ký (Gửi thông tin và nhận OTP)
const submitRegister = async () => {
  // Validate cơ bản trước khi gửi
  if (!form.fullName || !form.email || !form.password) {
    LuxuryAlert.fire({
      icon: 'warning',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Thiếu thông tin</h4>',
      text: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!',
      confirmButtonText: 'Đã hiểu'
    });
    return;
  }

  if (form.password.length < 6) {
    LuxuryAlert.fire({
      icon: 'warning',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Mật khẩu yếu</h4>',
      text: 'Mật khẩu bảo mật phải có ít nhất 6 ký tự.',
      confirmButtonText: 'Kiểm tra lại'
    });
    return;
  }

  isLoading.value = true;
  
  try {
    await api.post('/auth/register', form);
    
    // Chuyển sang giao diện nhập OTP
    step.value = 2; 
    
    // Hiện Toast nhẹ nhàng ở góc phải
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Mã xác thực đã được gửi!',
      text: 'Vui lòng kiểm tra hộp thư đến của bạn.',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    const backendError = error.response?.data?.error || 'Hệ thống đang gián đoạn. Vui lòng thử lại sau.';
    
    LuxuryAlert.fire({
      icon: 'error',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Đăng ký thất bại</h4>',
      text: backendError,
      confirmButtonText: 'Đóng'
    });
  } finally {
    isLoading.value = false;
  }
};

// BƯỚC 2: Xử lý Xác thực OTP
const submitVerify = async () => {
  if (!otpCode.value || otpCode.value.length < 6) {
    LuxuryAlert.fire({
      icon: 'warning',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Chưa hợp lệ</h4>',
      text: 'Vui lòng nhập đúng 6 số mã xác thực OTP.',
      confirmButtonText: 'Đã hiểu'
    });
    return;
  }

  isLoading.value = true;
  
  try {
    const payload = {
      email: form.email,
      otp: otpCode.value
    };

    const res = await api.post('/auth/verify-otp', payload);
    
    // Chúc mừng và chờ người dùng thao tác để về trang đăng nhập
    await LuxuryAlert.fire({
      icon: 'success',
      title: '<h3 class="luxury-font fw-bold mb-0 text-dark">Chúc Mừng</h3>',
      text: res.data.message || 'Xác thực hồ sơ VIP thành công!',
      confirmButtonText: 'Đăng nhập ngay'
    });
    
    // Đẩy về trang đăng nhập sau khi bấm nút
    router.push('/login');

  } catch (error) {
    console.error("Lỗi xác thực:", error);
    const backendError = error.response?.data?.error || 'Mã xác thực không hợp lệ hoặc đã hết hạn.';
    
    LuxuryAlert.fire({
      icon: 'error',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Xác thực thất bại</h4>',
      text: backendError,
      confirmButtonText: 'Nhập lại'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY REGISTER & OTP
========================================== */
.register-container {
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
.hover-gold:hover { color: #B38728 !important; }

/* Wrapper Form */
.register-wrapper {
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
.custom-alert-success { background: #fdfbf7; border: 1px solid #D4AF37; border-left: 4px solid #D4AF37; color: #B38728; }

/* Form Inputs (Step 1) */
.custom-input-group { border: 1px solid #e0e0e0; border-radius: 2px; transition: all 0.3s ease; background: #fafafa; }
.custom-input-group .input-group-text { background-color: transparent; border: none; color: #B38728; padding-right: 5px; }
.custom-input-group .form-control { border: none; background-color: transparent; box-shadow: none; padding: 12px 10px; font-size: 15px; color: #333; }
.custom-input-group:focus-within { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

/* Inputs OTP (Step 2) */
.icon-circle {
  width: 90px; height: 90px;
  border-radius: 50%;
  background: #fdfbf7;
  border: 1px dashed #D4AF37;
}

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
.register-link { color: #111; transition: all 0.3s; position: relative; }
.register-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: #D4AF37; transition: width 0.3s ease; }
.register-link:hover { color: #D4AF37; }
.register-link:hover::after { width: 100%; }

/* Nút Submit */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111; border: 1px solid #D4AF37; border-radius: 2px;
  transition: all 0.4s ease;
}
.btn-gold:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
}
.btn-gold:disabled { opacity: 0.7; filter: grayscale(50%); border-color: #ccc; cursor: not-allowed; box-shadow: none; }

/* Responsive */
@media (max-width: 576px) {
  .register-wrapper { padding: 2.5rem 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; }
}
</style>