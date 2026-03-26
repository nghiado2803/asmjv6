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

// 2. LỆNH "NHẬP HÀNG" TOÀN CỤC
onMounted(async () => {
  await productStore.fetchAllData(); 
  console.log("Dữ liệu hệ thống đã sẵn sàng.");
})

// 3. Kiểm tra xem có phải đang ở trang admin không
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

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