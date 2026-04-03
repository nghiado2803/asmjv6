<template>
  <Header />

  <main :style="{ 
    paddingTop: isAdminRoute ? '0' : '80px', 
    marginLeft: isAdminRoute ? '280px' : '0',
    minHeight: '100vh', 
    overflowX: 'hidden' 
  }">
    <RouterView />
  </main>

  <ChatWidget v-if="!isAdminRoute" />
  <Footer v-if="!isAdminRoute" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue' 
import { RouterView, useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore' 
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ChatWidget from '@/components/ChatWidget.vue'

// 1. Khởi tạo route và store
const route = useRoute()
const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchAllData(); 
  
  // --- Xử lý Google Login chuẩn xác ---
  const params = new URLSearchParams(window.location.search);
  const isGoogleLogin = params.get('login_google');
  let googleEmail = params.get('email');

  // Kiểm tra xem có đúng là email thật không (phải có dấu @)
  if (isGoogleLogin === 'true' && googleEmail && googleEmail.includes('@')) {
    localStorage.setItem('user', JSON.stringify(googleEmail));
    // 1. Lưu email sạch vào localStorage
    localStorage.setItem('email', googleEmail);
    localStorage.setItem('role', 'ROLE_USER');
    localStorage.setItem('token', 'google_authenticated_' + Date.now());

    // 2. Dọn dẹp URL ngay lập tức để tránh loop hoặc lỗi khi F5
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // 3. Thông báo và Reload để các component khác cập nhật
    console.log("Đăng nhập Google thành công với email:", googleEmail);
    window.location.reload();
    return; // Dừng lại sau khi reload
  } 
  
  // Trường hợp nếu lỡ lấy nhầm cái ID (dãy số) thì xóa luôn, không cho lưu
  if (googleEmail && !googleEmail.includes('@')) {
      console.error("Phát hiện email không hợp lệ (dãy số ID), đã chặn lưu rác.");
      window.history.replaceState({}, document.title, window.location.pathname);
  }
  // --- Kết thúc xử lý Google Login ---

  console.log("Dữ liệu hệ thống đã sẵn sàng.");
})

// 3. Kiểm tra xem có phải đang ở trang admin không
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>
/* Reset style chuẩn cho dự án Luxury Watch */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
}

/* Loại bỏ class #app mặc định của Vue gây vỡ layout Bootstrap */
#app {
  max-width: 100%;
  margin: 0;
  padding: 0;
  font-weight: normal;
}

/* Loại bỏ viền xanh khi focus - Chuẩn UI chuyên nghiệp */
input:focus, button:focus, textarea:focus, select:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Tùy chỉnh thanh cuộn cho sang trọng */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>