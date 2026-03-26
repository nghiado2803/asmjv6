<template>
  <div class="container-fluid p-4">
    <h3 class="fw-bold mb-4 text-dark">Tổng quan</h3>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 fw-bold text-muted">Đang tải dữ liệu hệ thống...</p>
    </div>

    <div v-else>
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div class="d-flex align-items-center">
              <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                <i class="bi bi-currency-dollar fs-3"></i>
              </div>
              <div class="ms-3">
                <p class="text-muted small mb-0 text-uppercase fw-bold">Tổng doanh thu</p>
                <h3 class="fw-bold mb-0 text-dark">{{ formatPrice(stats.totalRevenue) }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div class="d-flex align-items-center">
              <div class="bg-warning bg-opacity-10 text-warning rounded-3 p-3">
                <i class="bi bi-cart-check fs-3"></i>
              </div>
              <div class="ms-3">
                <p class="text-muted small mb-0 text-uppercase fw-bold">Đơn chờ xử lý</p>
                <h3 class="fw-bold mb-0 text-dark">{{ stats.newOrdersCount }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div class="d-flex align-items-center">
              <div class="bg-info bg-opacity-10 text-info rounded-3 p-3">
                <i class="bi bi-people fs-3"></i>
              </div>
              <div class="ms-3">
                <p class="text-muted small mb-0 text-uppercase fw-bold">Khách đăng ký mới</p>
                <h3 class="fw-bold mb-0 text-dark">{{ stats.newCustomersCount }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-0">
          <h6 class="fw-bold mb-0">Đơn hàng vừa đặt</h6>
          <router-link to="/admin/orders" class="btn btn-sm btn-outline-primary rounded-pill px-3">
            Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in stats.recentOrders" :key="order.id">
                  <td class="ps-4 fw-bold text-primary">#{{ order.id }}</td>
                  <td>{{ order.fullName }}</td>
                  <td>{{ formatDate(order.orderDate) }}</td>
                  <td class="fw-bold">{{ formatPrice(order.totalPrice) }}</td>
                  <td>
                    <span class="badge rounded-pill px-3 py-2" :class="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>

                <tr v-if="!stats.recentOrders || stats.recentOrders.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted">Chưa có đơn hàng nào.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/index'; // Import Axios đã cấu hình của mày

const isLoading = ref(true);

// Khởi tạo state chứa dữ liệu từ API
const stats = ref({
  totalRevenue: 0,
  newOrdersCount: 0,
  newCustomersCount: 0,
  recentOrders: [] as any[]
});

// Hàm gọi API /api/admin/dashboard-stats
const fetchDashboardStats = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/admin/dashboard-stats');
    stats.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
  } finally {
    isLoading.value = false;
  }
};

// Gọi API ngay khi vào trang
onMounted(() => {
  fetchDashboardStats();
});

// --- CÁC HÀM FORMATTER ---

const formatPrice = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

// [ĐÃ SỬA]: Format ngày tháng chuẩn Việt Nam (dd/MM/yyyy HH:mm:ss)
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Thêm giây
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Hoàn thành': 
      return 'bg-success bg-opacity-10 text-success';
    case 'Chờ xác nhận': 
      return 'bg-warning bg-opacity-10 text-warning';
    case 'Đã hủy': 
      return 'bg-danger bg-opacity-10 text-danger'; 
    default: 
      return 'bg-secondary bg-opacity-10 text-secondary';
  }
};
</script>

<style scoped>
/* Thêm transition nhẹ khi rê chuột vào dòng bảng */
.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.03);
}
</style>