<template>
  <div class="container py-5">
    <div class="row g-4">
      <div class="col-lg-3">
        <div class="account-sidebar">
          <div class="user-info-header">
            <img src="https://ui-avatars.com/api/?name=User&background=1a1a1a&color=fff&size=128" class="user-avatar" alt="Avatar">
            <h5 class="user-name">Nguyễn Văn A</h5>
            <span class="user-role">Thành viên</span>
          </div>
          <div class="account-nav">
            <router-link to="/profile" class="nav-link-custom" active-class="active"><i class="bi bi-person-bounding-box"></i> Hồ sơ cá nhân</router-link>
            <router-link to="/orders" class="nav-link-custom" active-class="active"><i class="bi bi-bag-check"></i> Lịch sử đơn hàng</router-link>
            <a href="#" class="nav-link-custom"><i class="bi bi-bell"></i> Thông báo</a>
            <router-link to="/change-password" class="nav-link-custom" active-class="active"><i class="bi bi-shield-lock"></i> Đổi mật khẩu</router-link>
            <hr class="my-2 opacity-25">
            <button class="nav-link-custom w-100 border-0 bg-transparent text-start text-danger"><i class="bi bi-box-arrow-left"></i> Đăng xuất</button>
          </div>
        </div>
      </div>

      <div class="col-lg-9">
        <div class="profile-card">
          <div class="border-bottom pb-3 mb-4">
            <h3 class="section-title">Đổi Mật Khẩu</h3>
            <span class="section-subtitle">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</span>
          </div>

          <div v-if="successMsg" class="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 mb-4">
            <i class="bi bi-check-circle-fill me-2"></i> {{ successMsg }}
          </div>
          <div v-if="errorMsg" class="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 mb-4">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}
          </div>

          <form @submit.prevent="updatePassword" style="max-width: 600px;">
            <div class="mb-4">
              <label class="form-label">Mật khẩu hiện tại</label>
              <input type="password" v-model="pwd.current" class="form-control-custom" required>
            </div>
            <div class="mb-4">
              <label class="form-label">Mật khẩu mới</label>
              <input type="password" v-model="pwd.new" class="form-control-custom" required minlength="6">
              <div class="form-text small text-muted mt-1"><i class="bi bi-info-circle"></i> Mật khẩu phải có ít nhất 6 ký tự.</div>
            </div>
            <div class="mb-4">
              <label class="form-label">Nhập lại mật khẩu mới</label>
              <input type="password" v-model="pwd.confirm" class="form-control-custom" required>
            </div>
            <div class="mt-5">
              <button type="submit" class="btn-save"><i class="bi bi-check-lg me-2"></i> Xác nhận thay đổi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const pwd = reactive({ current: '', new: '', confirm: '' });
const successMsg = ref('');
const errorMsg = ref('');

const updatePassword = () => {
  errorMsg.value = '';
  successMsg.value = '';
  
  if (pwd.new !== pwd.confirm) {
    errorMsg.value = 'Mật khẩu xác nhận không trùng khớp!';
    return;
  }
  
  // Logic gọi API đổi mật khẩu ở đây
  console.log("Password Payload:", pwd);
  successMsg.value = 'Đổi mật khẩu thành công!';
  pwd.current = ''; pwd.new = ''; pwd.confirm = '';
};
</script>

<style scoped>
/* CSS giống hệt file Profile.vue để đồng bộ giao diện */
.account-sidebar { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.03); position: sticky; top: 100px; }
.user-info-header { padding: 25px; text-align: center; border-bottom: 1px solid #f0f0f0; background: #fff; }
.user-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #f8f9fa; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 15px; }
.user-name { font-weight: 700; font-size: 1.1rem; margin-bottom: 2px; }
.user-role { font-size: 0.85rem; color: #999; text-transform: uppercase; letter-spacing: 1px; }
.nav-link-custom { display: flex; align-items: center; padding: 12px 25px; color: #555; text-decoration: none; transition: all 0.2s; font-weight: 500; border-left: 3px solid transparent; }
.nav-link-custom:hover { background-color: #f9f9f9; color: #d0021b; }
.nav-link-custom.active { color: #d0021b; background-color: #fff5f5; border-left-color: #d0021b; font-weight: 700; }
.nav-link-custom i { margin-right: 12px; font-size: 1.1rem; width: 20px; text-align: center; }
.profile-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); padding: 30px; }
.section-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 5px; }
.section-subtitle { color: #888; font-size: 0.9rem; margin-bottom: 25px; display: block; }
.form-label { font-weight: 500; font-size: 0.9rem; color: #444; margin-bottom: 8px; }
.form-control-custom { border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px 15px; transition: 0.2s; background-color: #fff; width: 100%; }
.form-control-custom:focus { border-color: #d0021b; box-shadow: 0 0 0 3px rgba(208, 2, 27, 0.1); outline: none; }
.btn-save { background: #1a1a1a; color: #fff; padding: 12px 30px; border-radius: 6px; font-weight: 700; border: none; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.9rem; }
.btn-save:hover { background: #d0021b; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
</style>