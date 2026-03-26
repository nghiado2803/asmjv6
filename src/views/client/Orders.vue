<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h3 class="fw-bold mb-4 text-dark border-start border-4 border-primary ps-3">Lịch sử đơn hàng</h3>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted fw-bold">Đang tải lịch sử giao dịch...</p>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
          <i class="bi bi-box-seam display-1 text-muted opacity-25"></i>
          <h5 class="mt-3 text-muted">Bạn chưa có đơn hàng nào</h5>
          <router-link to="/products" class="btn btn-primary rounded-pill px-4 mt-3 shadow-sm">Mua sắm ngay</router-link>
        </div>

        <div v-else>
          <div v-for="order in orders" :key="order.id" class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span class="fw-bold text-primary me-2">#{{ order.code || order.id }}</span>
                <span class="badge bg-light text-dark border small">
                  <i class="bi bi-credit-card me-1"></i> {{ order.paymentMethod }}
                </span>
                <span class="text-muted small border-start ps-2 ms-2">{{ formatDate(order.orderDate) }}</span>
              </div>
              <span class="badge rounded-pill px-3 py-2"
                    :class="order.status === 'Chờ xác nhận' ? 'bg-warning text-dark bg-opacity-25' : 'bg-success bg-opacity-10 text-success'">
                {{ order.status }}
              </span>
            </div>

            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <div v-for="detail in order.orderDetails" :key="detail.productId" class="list-group-item p-3 border-0 border-bottom">
                  <div class="d-flex align-items-center">
                    <div style="width: 70px; height: 70px; flex-shrink: 0;" class="border rounded overflow-hidden p-1 bg-white">
                      <img :src="getImageUrl(detail.imageUrl)" class="w-100 h-100 object-fit-contain" @error="handleImageError">
                    </div>
                    <div class="ms-3 flex-grow-1">
                      <h6 class="fw-bold mb-1">
                        <router-link :to="`/product/${detail.productId}`" class="text-decoration-none text-dark">{{ detail.name }}</router-link>
                      </h6>
                      <div class="d-flex justify-content-between align-items-end">
                        <small class="text-muted">x{{ detail.quantity }}</small>
                        <span class="fw-bold text-dark small">{{ formatPrice(detail.price) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer bg-light border-0 py-3">
              <div class="row align-items-center gy-2">
                <div class="col-md-6">
                  <div class="small text-muted text-truncate">
                    <i class="bi bi-geo-alt-fill me-1 text-danger"></i> <span>{{ order.address }}</span>
                  </div>
                </div>
                <div class="col-md-6 text-md-end d-flex align-items-center justify-content-md-end justify-content-between">
                  <div class="me-3">
                    <span class="text-muted small me-1">Tổng tiền:</span>
                    <span class="fw-bold text-danger fs-5">{{ formatPrice(order.totalPrice) }}</span>
                  </div>
                  <router-link :to="`/order/${order.id}`" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                    Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/index';

const orders = ref<any[]>([]);
const isLoading = ref(true);

const formatPrice = (val: number) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getImageUrl = (img: string) => {
  if (!img) return 'https://via.placeholder.com/70';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/70';
};

const getUserEmail = () => {
  try {
    let email = localStorage.getItem('user') || localStorage.getItem('email');
    if (email) {
      return email.replace(/"/g, ''); 
    }
  } catch (e) {
    return '';
  }
  return '';
};

// Gọi API lấy Data thật
const fetchMyOrders = async () => {
  isLoading.value = true;
  const emailParam = getUserEmail();
  
  try {
    const res = await api.get(`/orders/my-orders?email=${encodeURIComponent(emailParam)}`);
    orders.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy lịch sử đơn hàng:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMyOrders();
});
</script>

<style scoped>
.object-fit-contain { object-fit: contain; }
</style>