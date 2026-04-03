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
                <h3 class="section-title luxury-font text-uppercase letter-spacing-1 mb-1 text-dark">Hồ Sơ Của Quý Khách</h3>
                <span class="section-subtitle text-muted letter-spacing-1 small">Quản lý thông tin cá nhân để bảo mật tài khoản</span>
              </div>
            </div>

            <div v-if="successMsg" class="alert custom-alert-success border-0 rounded-1 mb-4 d-flex align-items-center">
              <i class="bi bi-check-circle-fill fs-5 me-3"></i> 
              <span class="fw-bold letter-spacing-1 small text-uppercase">{{ successMsg }}</span>
            </div>
            <div v-if="errorMsg" class="alert custom-alert-danger border-0 rounded-1 mb-4 d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill fs-5 me-3"></i> 
              <span class="fw-bold letter-spacing-1 small text-uppercase">{{ errorMsg }}</span>
            </div>

            <div v-if="isLoading && !user.email" class="text-center py-5">
              <div class="spinner-border gold-text" role="status"></div>
              <p class="mt-3 text-muted fw-bold text-uppercase small letter-spacing-1">Đang tải hồ sơ...</p>
            </div>

            <form v-else @submit.prevent="updateProfile" class="px-md-2">
              <div class="row g-5">
                <div class="col-md-8">
                  
                  <div class="mb-4">
                    <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted">Họ và tên</label>
                    <input type="text" v-model="user.fullName" class="form-control-custom w-100" placeholder="Nhập họ và tên..." required>
                  </div>
                  
                  <div class="row g-4 mb-4">
                    <div class="col-md-6">
                      <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted d-flex justify-content-between">
                        Email <small class="text-danger text-lowercase fst-italic" style="letter-spacing: 0;">*Không thể đổi</small>
                      </label>
                      <input type="email" v-model="user.email" class="form-control-custom w-100 input-disabled" readonly disabled>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted">Số điện thoại</label>
                      <input type="text" v-model="user.phoneNumber" class="form-control-custom w-100" placeholder="09xx...">
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label text-uppercase letter-spacing-1 small fw-bold text-muted">Địa chỉ nhận hàng mặc định</label>
                    <textarea v-model="user.address" class="form-control-custom w-100" rows="4" placeholder="Nhập địa chỉ chi tiết..."></textarea>
                  </div>

                  <div class="mt-5 pt-3 border-top border-gold-subtle">
                    <button type="submit" class="btn-save text-uppercase letter-spacing-1 fw-bold px-5 py-3" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <span v-else><i class="bi bi-shield-check me-2"></i> Cập Nhật Hồ Sơ</span>
                    </button>
                  </div>
                  
                </div>

                <div class="col-md-4 d-none d-md-flex flex-column align-items-center justify-content-center border-start border-gold-subtle text-center px-4">
                  <i class="bi bi-shield-lock gold-text display-1 opacity-25 mb-3"></i>
                  <h6 class="luxury-font fw-bold text-uppercase letter-spacing-1 text-dark mb-2">Bảo mật tối đa</h6>
                  <p class="text-muted small" style="line-height: 1.8;">Thông tin của quý khách được mã hóa và bảo mật tuyệt đối trên hệ thống máy chủ của chúng tôi.</p>
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

const router = useRouter();
const successMsg = ref('');
const errorMsg = ref('');
const isLoading = ref(true);

const user = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  role: ''
});

// Lấy email từ LocalStorage
const getUserEmail = () => {
  try {
    let email = localStorage.getItem('user') || localStorage.getItem('email');
    if (email) return email.replace(/"/g, ''); 
  } catch (e) { return ''; }
  return '';
};

// Gọi API lấy dữ liệu đổ vào form
const fetchProfile = async () => {
  isLoading.value = true;
  const emailParam = getUserEmail();
  
  if (!emailParam) {
    errorMsg.value = "Chưa có thông tin đăng nhập!";
    isLoading.value = false;
    return;
  }

  try {
    const res = await api.get(`/profile?email=${encodeURIComponent(emailParam)}`);
    const data = res.data;
    
    user.fullName = data.fullName || '';
    user.email = data.email || '';
    user.phoneNumber = data.phoneNumber || '';
    user.address = data.address || '';
    user.role = data.role || 'ROLE_USER';
  } catch (error) {
    console.error("Lỗi khi tải profile:", error);
    errorMsg.value = "Không thể tải thông tin hồ sơ!";
  } finally {
    isLoading.value = false;
  }
};

// Gọi API lưu dữ liệu
const updateProfile = async () => {
  isLoading.value = true;
  const emailParam = getUserEmail();
  try {
    const payload = {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address
    };

    await api.post(`/profile/update?email=${encodeURIComponent(emailParam)}`, payload);
    
    successMsg.value = 'Cập nhật hồ sơ thành công!';
    errorMsg.value = '';
    setTimeout(() => successMsg.value = '', 4000);
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    errorMsg.value = "Đã xảy ra lỗi. Vui lòng thử lại!";
    successMsg.value = '';
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => { 
  if(confirm('Quý khách có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    router.push('/login'); 
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY PROFILE
========================================== */
.luxury-profile-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fcfaf8 !important; }
.luxury-font { font-family: 'Montserrat', sans-serif;}
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }

/* Alerts */
.custom-alert-success { background: #fdfbf7; border-left: 4px solid #D4AF37 !important; color: #B38728; }
.custom-alert-danger { background: #fff5f5; border-left: 4px solid #8b0000 !important; color: #8b0000; }

/* Sidebar Tài khoản */
.account-sidebar { 
  background: #ffffff; 
  border-radius: 2px; /* Vuông vức chuẩn Luxury */
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
.input-disabled { background-color: #f5f5f5 !important; color: #888 !important; border-color: #eee !important; cursor: not-allowed; }

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
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
</style>