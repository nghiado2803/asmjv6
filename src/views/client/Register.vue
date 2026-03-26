<template>
  <div class="register-container">
    <div class="register-image-side">
      <div class="register-quote">
        <h1 class="quote-text">"Khởi đầu hành trình phong cách của bạn."</h1>
        <p class="fs-5 text-white-50">- WatchStore Member -</p>
      </div>
    </div>

    <div class="register-form-side">
      <div class="register-wrapper">
        <div class="mb-4">
          <h2 class="register-title">Tạo tài khoản mới</h2>
          <p class="register-subtitle">Điền thông tin bên dưới để tham gia cùng chúng tôi.</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row g-4">
            <div class="col-12">
              <label class="form-label fw-bold small">Họ và tên</label>
              <input type="text" v-model="form.fullName" class="form-control" placeholder="Ví dụ: Nguyễn Văn A" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold small">Email</label>
              <input type="email" v-model="form.email" class="form-control" placeholder="name@example.com" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold small">Số điện thoại</label>
              <input type="text" v-model="form.phoneNumber" class="form-control" placeholder="09xxxx">
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold small">Mật khẩu</label>
              <input type="password" v-model="form.password" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold small">Nhập lại mật khẩu</label>
              <input type="password" v-model="form.confirmPassword" class="form-control" required>
            </div>
            <div class="col-12 mt-4">
              <button class="btn-register shadow-sm" type="submit">Đăng Ký Tài Khoản</button>
            </div>
          </div>
        </form>

        <div class="text-center mt-4">
          <span class="text-muted small">Đã có tài khoản?</span>
          <router-link to="/login" class="text-decoration-none fw-bold ms-1 text-danger">Đăng nhập ngay</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const form = reactive({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });

const handleRegister = () => {
  if(form.password !== form.confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }
  console.log("Register Payload:", form);
};
</script>

<style scoped>
/* Paste CSS từ thẻ style trong register.html */
.register-container { min-height: 100vh; display: flex; margin-top: -80px;}
.register-image-side { background: url('https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat; position: relative; flex: 1; display: flex; align-items: center; justify-content: center; color: white; }
.register-image-side::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)); }
.register-quote { position: relative; z-index: 2; text-align: center; padding: 2rem; max-width: 80%; }
.quote-text { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
.register-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #fff; max-width: 650px; }
.register-wrapper { width: 100%; max-width: 500px; }
.register-title { font-size: 2rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
.register-subtitle { color: #888; margin-bottom: 2rem; }
.form-control { border: none; border-bottom: 2px solid #eee; border-radius: 0; padding: 10px 0; background: transparent; box-shadow: none !important; }
.form-control:focus { border-bottom-color: #d0021b; background: transparent; }
.form-label { color: #999; font-size: 0.9rem; margin-bottom: 0; }
.btn-register { background: #1a1a1a; color: #fff; height: 50px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; width: 100%; border: none; transition: 0.3s; }
.btn-register:hover { background: #d0021b; color: #fff; transform: translateY(-2px); }
@media (max-width: 992px) { .register-image-side { display: none; } .register-form-side { max-width: 100%; flex: auto; } }
</style>