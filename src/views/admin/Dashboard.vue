<template>
  <div class="admin-dashboard-page p-4 p-md-5">
    
    <div class="d-flex align-items-center mb-5">
      <div class="title-accent me-3"></div>
      <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Tổng quan hệ thống</h3>
    </div>

    <div v-if="isLoading" class="text-center py-5 my-5">
      <div class="spinner-border gold-text" role="status"></div>
      <p class="mt-3 fw-bold text-muted text-uppercase letter-spacing-1 small">Đang tải dữ liệu...</p>
    </div>

    <div v-else>
      <div class="row g-4 mb-5">
        
        <div class="col-md-4">
          <div class="card luxury-stat-card h-100">
            <div class="card-body p-4 d-flex align-items-center">
              <div class="icon-box icon-gold me-4">
                <i class="bi bi-wallet2 fs-3"></i>
              </div>
              <div>
                <p class="text-muted small mb-1 text-uppercase fw-bold letter-spacing-1">Tổng doanh thu</p>
                <h3 class="fw-bold mb-0 text-dark luxury-font">{{ formatPrice(stats.totalRevenue) }}</h3>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 px-4 pb-3 pt-0">
              <small class="text-success fw-bold"><i class="bi bi-arrow-up-right me-1"></i> Tăng trưởng ổn định</small>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card luxury-stat-card h-100">
            <div class="card-body p-4 d-flex align-items-center">
              <div class="icon-box icon-dark me-4">
                <i class="bi bi-box-seam fs-3"></i>
              </div>
              <div>
                <p class="text-muted small mb-1 text-uppercase fw-bold letter-spacing-1">Đơn chờ xử lý</p>
                <h3 class="fw-bold mb-0 text-dark luxury-font">{{ stats.newOrdersCount }} <span class="fs-6 text-muted fw-normal">đơn</span></h3>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 px-4 pb-3 pt-0">
              <router-link to="/admin/orders" class="text-decoration-none gold-text small fw-bold hover-gold letter-spacing-1">Xử lý ngay <i class="bi bi-arrow-right ms-1"></i></router-link>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card luxury-stat-card h-100">
            <div class="card-body p-4 d-flex align-items-center">
              <div class="icon-box icon-light me-4">
                <i class="bi bi-people fs-3"></i>
              </div>
              <div>
                <p class="text-muted small mb-1 text-uppercase fw-bold letter-spacing-1">Khách VIP mới</p>
                <h3 class="fw-bold mb-0 text-dark luxury-font">{{ stats.newCustomersCount }} <span class="fs-6 text-muted fw-normal">người</span></h3>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 px-4 pb-3 pt-0">
              <router-link to="/admin/users" class="text-decoration-none text-muted small fw-bold hover-gold letter-spacing-1">Xem danh sách <i class="bi bi-arrow-right ms-1"></i></router-link>
            </div>
          </div>
        </div>
        
      </div>

      <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
        
        <div class="card-header bg-transparent py-4 px-4 d-flex justify-content-between align-items-center border-bottom border-gold-subtle">
          <h6 class="fw-bold mb-0 text-uppercase letter-spacing-1 text-dark"><i class="bi bi-clock-history gold-text me-2 fs-5"></i>Giao dịch gần nhất</h6>
          <router-link to="/admin/orders" class="btn btn-sm btn-outline-gold px-3 fw-bold text-uppercase letter-spacing-1" style="font-size: 11px;">
            Xem tất cả
          </router-link>
        </div>
        
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table luxury-table align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4 text-uppercase letter-spacing-1">Mã đơn</th>
                  <th class="text-uppercase letter-spacing-1">Khách hàng</th>
                  <th class="text-uppercase letter-spacing-1">Ngày lập</th>
                  <th class="text-uppercase letter-spacing-1">Tổng tiền</th>
                  <th class="text-uppercase letter-spacing-1">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in stats.recentOrders" :key="order.id" class="table-row-hover">
                  <td class="ps-4 fw-bold text-dark luxury-font">#{{ order.id }}</td>
                  <td class="fw-bold">{{ order.fullName }}</td>
                  <td class="text-muted small letter-spacing-1">{{ formatDate(order.orderDate) }}</td>
                  <td class="fw-bold gold-text">{{ formatPrice(order.totalPrice) }}</td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>

                <tr v-if="!stats.recentOrders || stats.recentOrders.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted fst-italic">Hệ thống chưa ghi nhận giao dịch nào.</td>
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
import api from '@/api/index'; 

const isLoading = ref(true);

const stats = ref({
  totalRevenue: 0,
  newOrdersCount: 0,
  newCustomersCount: 0,
  recentOrders: [] as any[]
});

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

onMounted(() => {
  fetchDashboardStats();
});

const formatPrice = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0'); 
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Hoàn thành': 
      return 'status-success';
    case 'Chờ xác nhận': 
      return 'status-pending';
    case 'Đã hủy': 
      return 'status-danger'; 
    default: 
      return 'status-default';
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN DASHBOARD
========================================== */
.admin-dashboard-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }

.hover-gold { transition: 0.3s; }
.hover-gold:hover { color: #B38728 !important; padding-left: 5px; }

/* Thẻ Thống kê (Stat Cards) */
.luxury-stat-card {
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 2px; /* Chuẩn form góc cạnh */
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  transition: all 0.4s ease;
}
.luxury-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border-color: #D4AF37;
}

/* Icon Boxes */
.icon-box {
  width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 2px;
}
.icon-gold { background: #fdfbf7; color: #D4AF37; border: 1px solid #e8dcc4; }
.icon-dark { background: #1a1a1a; color: #fff; }
.icon-light { background: #f0f0f0; color: #555; border: 1px solid #ddd; }

/* Bảng Dữ liệu (Table) */
.luxury-table { margin-bottom: 0; }
.luxury-table thead { background-color: #fafafa; }
.luxury-table th { 
  font-size: 11px; 
  color: #888; 
  font-weight: 700; 
  padding: 15px 10px; 
  border-bottom: 1px solid #eaeaea;
}
.luxury-table td { 
  padding: 18px 10px; 
  color: #444; 
  border-bottom: 1px solid #f5f5f5; 
}
.table-row-hover { transition: all 0.2s ease; background-color: #fff; }
.table-row-hover:hover { background-color: #fdfbf7; }

/* Status Badges */
.status-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 2px;
  letter-spacing: 1px;
}
.status-pending { background: #fff5e6; color: #b37700; border: 1px solid #ffd699; }
.status-success { background: #e6f2e6; color: #1a661a; border: 1px solid #99cc99; }
.status-danger { background: #fff0f0; color: #cc0000; border: 1px solid #ffcccc; }
.status-default { background: #f5f5f5; color: #666; border: 1px solid #ddd; }

/* Buttons */
.btn-outline-gold {
  background: #fff; border: 1px solid #D4AF37; color: #B38728;
  border-radius: 2px; transition: all 0.3s ease;
}
.btn-outline-gold:hover {
  background: #D4AF37; color: #fff;
}
</style>