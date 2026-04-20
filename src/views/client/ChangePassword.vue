<template>
  <div class="luxury-profile-page bg-light min-vh-100 py-5">
    <div class="container">
      <div class="row g-5">
        
        <div class="col-lg-3">
          <div class="account-sidebar shadow-sm">
            
            <div class="user-info-header">
              <div class="avatar-wrapper mb-3">
                <img :src="`https://ui-avatars.com/api/?name=${user.fullName || 'User'}&background=D4AF37&color=fff&size=128&bold=true`" class="user-avatar" alt="Avatar">
              </div>
              <h5 class="user-name luxury-font text-dark">{{ user.fullName || 'Khách hàng VIP' }}</h5>
              <div class="user-role-badge mt-2">
                <i class="bi bi-award-fill gold-text me-1"></i>
                <span>{{ user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' ? 'Quản Trị Viên' : 'Thành viên VIP' }}</span>
              </div>
            </div>
            
            <div class="account-nav mt-3">
              <router-link to="/profile" class="nav-link-custom" active-class="active">
                <i class="bi bi-person-lines-fill"></i> Hồ sơ cá nhân
              </router-link>
              <router-link to="/orders" class="nav-link-custom" active-class="active">
                <i class="bi bi-clock-history"></i> Lịch sử giao dịch
              </router-link>
              <router-link to="/change-password" class="nav-link-custom" active-class="active">
                <i class="bi bi-shield-lock-fill"></i> Đổi mật khẩu
              </router-link>
              <div class="px-4 my-3"><hr class="border-gold-subtle m-0"></div>
              <button @click="handleLogout" class="nav-link-custom w-100 border-0 bg-transparent text-start text-danger hover-danger">
                <i class="bi bi-box-arrow-right"></i> Đăng xuất
              </button>
            </div>
            
          </div>
        </div>

        <div class="col-lg-9">
          <div class="profile-card shadow-sm h-100">
            
            <div class="d-flex justify-content-between align-items-end border-bottom border-gold-subtle pb-3 mb-4">
              <div>
                <h3 class="section-title luxury-font text-uppercase letter-spacing-1 mb-1 text-dark">Bảo mật tài khoản</h3>
                <span class="section-subtitle text-muted letter-spacing-1 small">Để bảo mật thông tin, tuyệt đối không chia sẻ mật khẩu cho người khác</span>
              </div>
            </div>
            <form @submit.prevent="updatePassword" class="px-md-2 mt-4">
              <div class="row g-5">
                <div class="col-md-8">
                  
                  <div class="mb-4">
                    <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted">Mật khẩu hiện tại</label>
                    <input type="password" v-model="pwd.current" class="form-control-custom w-100" placeholder="Nhập mật khẩu cũ..." required :disabled="isLoading">
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted">Mật khẩu mới</label>
                    <input type="password" v-model="pwd.new" class="form-control-custom w-100" placeholder="Tối thiểu 6 ký tự..." required minlength="6" :disabled="isLoading">
                    <div class="form-text small text-muted mt-2 fst-italic letter-spacing-1">
                      <i class="bi bi-shield-check gold-text me-1"></i> Khuyến nghị sử dụng mật khẩu mạnh bao gồm chữ và số.
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted">Nhập lại mật khẩu mới</label>
                    <input type="password" v-model="pwd.confirm" class="form-control-custom w-100" placeholder="Xác nhận lại mật khẩu mới..." required :disabled="isLoading">
                  </div>
                  
                  <div class="mt-5 pt-3 border-top border-gold-subtle">
                    <button type="submit" class="btn-save text-uppercase letter-spacing-1 fw-bold px-5 py-3" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <span v-else><i class="bi bi-key-fill me-2"></i> Xác nhận thay đổi</span>
                    </button>
                  </div>
                  
                </div>

                <div class="col-md-4 d-none d-md-flex flex-column align-items-center justify-content-center border-start border-gold-subtle text-center px-4">
                  <i class="bi bi-safe2 gold-text display-1 opacity-25 mb-3"></i>
                  <h6 class="luxury-font fw-bold text-uppercase letter-spacing-1 text-dark mb-2">Trung tâm bảo mật</h6>
                  <p class="text-muted small" style="line-height: 1.8;">WatchStore áp dụng giao thức mã hóa tiên tiến nhất để bảo vệ tuyệt đối thông tin và tài sản số của quý khách.</p>
                </div>
              </div>
            </form>
            
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/index';
import Swal from 'sweetalert2'; // Thêm SweetAlert2

const router = useRouter();
const pwd = reactive({ current: '', new: '', confirm: '' });
const isLoading = ref(false);

const user = reactive({
  fullName: '',
  role: ''
});

// Cấu hình Swal theo chuẩn Luxury
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1',
    cancelButton: 'btn btn-outline-secondary rounded-1 fw-bold px-4 py-2 ms-2 text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

const getUserEmail = () => {
  try {
    let email = localStorage.getItem('user') || localStorage.getItem('email');
    if (email) return email.replace(/"/g, ''); 
  } catch (e) { return ''; }
  return '';
};

const fetchUserInfo = async () => {
  const emailParam = getUserEmail();
  if (!emailParam) return;

  try {
    const res = await api.get(`/profile?email=${encodeURIComponent(emailParam)}`);
    user.fullName = res.data.fullName || '';
    user.role = res.data.role || 'ROLE_USER';
  } catch (error) {
    console.error("Lỗi lấy thông tin user:", error);
  }
};

const updatePassword = async () => {
  // Bắt lỗi Validation bằng Popup thay vì Text
  if (pwd.new !== pwd.confirm) {
    LuxuryAlert.fire({
      icon: 'warning',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Lỗi xác nhận</h4>',
      text: 'Mật khẩu xác nhận không trùng khớp!',
      confirmButtonText: 'Kiểm tra lại'
    });
    return;
  }
  
  if (pwd.new.length < 6) {
    LuxuryAlert.fire({
      icon: 'warning',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Mật khẩu yếu</h4>',
      text: 'Mật khẩu mới phải có ít nhất 6 ký tự để đảm bảo an toàn.',
      confirmButtonText: 'Đã hiểu'
    });
    return;
  }

  const emailParam = getUserEmail();
  if (!emailParam) {
    LuxuryAlert.fire({
      icon: 'error',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Hết phiên làm việc</h4>',
      text: 'Vui lòng đăng nhập lại để tiếp tục thao tác.',
      confirmButtonText: 'Đăng nhập ngay'
    }).then(() => {
      router.push('/login');
    });
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      currentPassword: pwd.current,
      newPassword: pwd.new
    };

    await api.post(`/profile/change-password?email=${encodeURIComponent(emailParam)}`, payload);
    
    // Thành công: Hiển thị Toast mượt mà ở góc màn hình
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Đổi mật khẩu thành công!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });

    // Reset form
    pwd.current = ''; 
    pwd.new = ''; 
    pwd.confirm = '';
    
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    
    // Xử lý lỗi từ Backend
    const backendError = error.response?.data?.error || "Hệ thống đang gián đoạn. Vui lòng thử lại sau!";
    LuxuryAlert.fire({
      icon: 'error',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Thất bại</h4>',
      text: backendError,
      confirmButtonText: 'Đóng'
    });
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = async () => { 
  // Thay thế confirm() xấu xí bằng SweetAlert2
  const result = await LuxuryAlert.fire({
    title: '<h3 class="luxury-font fw-bold mb-0 text-dark">Xác nhận đăng xuất</h3>',
    text: 'Quý khách có chắc chắn muốn đăng xuất khỏi hệ thống?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đăng xuất',
    cancelButtonText: 'Hủy bỏ'
  });

  if (result.isConfirmed) {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    
    // Tùy chọn: Thêm Toast thông báo tạm biệt nhỏ
    Swal.fire({
      toast: true, position: 'top-end', icon: 'info',
      title: 'Đã đăng xuất an toàn!', showConfirmButton: false, timer: 1500
    });

    router.push('/login'); 
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY CHANGE PASSWORD
========================================== */
.luxury-profile-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fcfaf8 !important; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }

/* Alerts */
.custom-alert-success { background: #fdfbf7; border-left: 4px solid #D4AF37 !important; color: #B38728; }
.custom-alert-danger { background: #fff5f5; border-left: 4px solid #8b0000 !important; color: #8b0000; }

/* Sidebar Tài khoản (Đồng bộ Profile) */
.account-sidebar { 
  background: #ffffff; 
  border-radius: 2px; 
  border: 1px solid #eaeaea;
  overflow: hidden; 
  position: sticky; top: 100px; 
}
.user-info-header { padding: 35px 20px 25px; text-align: center; border-bottom: 1px dashed #eaeaea; background: #fff; }
.avatar-wrapper { 
  width: 90px; height: 90px; margin: 0 auto; 
  border-radius: 50%; padding: 3px; 
  border: 1px solid #D4AF37; 
}
.user-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

.user-name { font-weight: 800; font-size: 1.2rem; margin-bottom: 5px; }
.user-role-badge { 
  display: inline-block; background: #fdfbf7; color: #111; 
  font-size: 10px; text-transform: uppercase; letter-spacing: 1px; 
  padding: 4px 10px; border-radius: 2px; border: 1px solid #e8dcc4; font-weight: bold;
}

/* Nav Menu */
.account-nav { padding-bottom: 20px; }
.nav-link-custom { 
  display: flex; align-items: center; padding: 14px 25px; 
  color: #555; text-decoration: none; transition: all 0.3s; 
  font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;
  border-left: 3px solid transparent; 
}
.nav-link-custom i { margin-right: 15px; font-size: 1.1rem; width: 20px; text-align: center; color: #aaa; transition: 0.3s; }
.nav-link-custom:hover { background-color: #fdfbf7; color: #B38728; }
.nav-link-custom:hover i { color: #B38728; }

.nav-link-custom.active { 
  color: #111; background-color: #fdfbf7; 
  border-left-color: #D4AF37; font-weight: 700; 
}
.nav-link-custom.active i { color: #D4AF37; }

.hover-danger { transition: 0.3s; }
.hover-danger:hover { color: #8b0000 !important; background-color: #fff5f5 !important; }
.hover-danger:hover i { color: #8b0000 !important; }

/* Profile Card (Nội dung chính) */
.profile-card { 
  background: #fff; border-radius: 2px; 
  border: 1px solid #eaeaea; padding: 40px; 
}
@media (max-width: 768px) { .profile-card { padding: 25px; } }

/* Inputs */
.form-control-custom { 
  border: 1px solid #e0e0e0; border-radius: 2px; 
  padding: 12px 15px; transition: 0.3s; background-color: #fafafa; 
  font-size: 15px; color: #333;
}
.form-control-custom:focus { 
  border-color: #D4AF37; background: #fff;
  box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); outline: none; 
}
.form-control-custom:disabled { background-color: #f5f5f5; color: #888; border-color: #eee; cursor: not-allowed; }

/* Button Save */
.btn-save { 
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111; border: 1px solid #D4AF37; border-radius: 2px;
  transition: all 0.4s ease; display: inline-block;
}
.btn-save:hover:not(:disabled) { 
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); 
}
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; filter: grayscale(50%); border-color: #ccc; }
</style>