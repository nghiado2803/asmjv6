<template>
  <div class="container-fluid p-4">
    <h3 class="fw-bold mb-4 text-dark">Thống kê kinh doanh</h3>

    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white h-100" style="background: linear-gradient(45deg, #0d6efd, #0a58ca);">
          <div class="card-body">
            <h6 class="text-white-50 text-uppercase small fw-bold">Tổng doanh thu</h6>
            <h3 class="fw-bold mt-2">{{ formatPrice(stats.totalRevenue) }}</h3>
            <small class="text-white-50"><i class="bi bi-graph-up-arrow"></i> Tích lũy toàn thời gian</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
          <div class="card-body">
            <h6 class="text-muted text-uppercase small fw-bold">Đơn hàng thành công</h6>
            <h3 class="fw-bold mt-2 text-dark">{{ stats.successfulOrders || 0 }}</h3>
            <small class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> Đã giao & Thanh toán</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
          <div class="card-body">
            <h6 class="text-muted text-uppercase small fw-bold">Tổng tồn kho</h6>
            <h3 class="fw-bold mt-2 text-dark">{{ stats.totalStock || 0 }}</h3>
            <small class="text-primary fw-bold"><i class="bi bi-box-seam-fill"></i> Sản phẩm sẵn sàng</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
          <div class="card-body">
            <h6 class="text-muted text-uppercase small fw-bold">Khách hàng mới</h6>
            <h3 class="fw-bold mt-2 text-dark">{{ stats.newCustomersToday || 0 }}</h3>
            <small class="text-warning fw-bold"><i class="bi bi-person-plus-fill"></i> Đăng ký hôm nay</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0"><i class="bi bi-bar-chart-fill me-2 text-primary"></i>Biểu đồ doanh thu năm {{ currentYear }}</h6>
          </div>
          <div class="card-body">
            <div style="height: 350px;" v-if="!isLoading">
              <canvas id="revenueChart"></canvas>
            </div>
            <div v-else class="d-flex justify-content-center align-items-center h-100">
              <div class="spinner-border text-primary"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white py-3 border-0">
            <h6 class="fw-bold mb-0">Sản phẩm giá trị cao</h6>
          </div>
          
          <ul class="list-group list-group-flush" v-if="stats.topProducts && stats.topProducts.length > 0">
            <li v-for="(p, index) in stats.topProducts" :key="p.id" class="list-group-item border-0 d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <span class="badge rounded-circle me-3" 
                      :class="index === 0 ? 'bg-warning' : (index === 1 ? 'bg-secondary' : (index === 2 ? 'bg-danger' : 'bg-light text-dark border'))" 
                      style="width: 25px; height: 25px; display: flex; align-items: center; justify-content: center;">
                  {{ index + 1 }}
                </span>
                <div>
                  <span class="fw-bold d-block text-truncate" style="max-width: 150px;">{{ p.name }}</span>
                  <small class="text-muted">{{ p.brand }}</small>
                </div>
              </div>
              <span class="fw-bold text-primary small">{{ formatPrice(p.price) }}</span>
            </li>
          </ul>

          <div v-else class="card-body text-center text-muted d-flex align-items-center justify-content-center" style="min-height: 200px;">
            <p class="mb-0">Chưa có dữ liệu sản phẩm.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white py-3 border-bottom">
            <h6 class="fw-bold mb-0 text-success"><i class="bi bi-tags-fill me-2"></i>Thống kê theo Loại hàng</h6>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light text-secondary small">
                <tr>
                  <th class="ps-4">Tên loại hàng</th>
                  <th>SL Bán</th>
                  <th>Giá thấp nhất</th>
                  <th>Giá cao nhất</th>
                  <th>Giá trung bình</th>
                  <th class="text-end pe-4">Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in stats.categoryStats" :key="index">
                  <td class="ps-4 fw-bold">{{ row[0] }}</td>
                  <td>{{ row[2] }}</td>
                  <td>{{ formatPrice(row[3]) }}</td>
                  <td>{{ formatPrice(row[4]) }}</td>
                  <td>{{ formatPrice(row[5]) }}</td>
                  <td class="text-end pe-4 fw-bold text-success">{{ formatPrice(row[1]) }}</td>
                </tr>
                <tr v-if="!stats.categoryStats || stats.categoryStats.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">Chưa có dữ liệu bán hàng.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 mb-5">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0 text-warning"><i class="bi bi-trophy-fill me-2"></i>Top 10 Khách hàng VIP</h6>
            <span class="badge bg-warning text-dark">Chi tiêu cao nhất</span>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light text-secondary small">
                <tr>
                  <th class="ps-4">#</th>
                  <th>Tên khách hàng</th>
                  <th>Ngày mua đầu tiên</th>
                  <th>Ngày mua gần nhất</th>
                  <th class="text-end pe-4">Tổng tiền đã mua</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in stats.vipCustomers" :key="i">
                  <td class="ps-4">
                    <span class="badge rounded-circle bg-light text-dark border"
                          :class="i === 0 ? 'bg-warning border-warning' : (i === 1 ? 'bg-secondary text-white' : (i === 2 ? 'bg-danger text-white' : ''))"
                          style="width: 25px; height: 25px; display: flex; align-items: center; justify-content: center;">
                      {{ i + 1 }}
                    </span>
                  </td>
                  <td class="fw-bold">{{ row[0] }}</td>
                  <td>{{ formatDate(row[2]) }}</td>
                  <td>{{ formatDate(row[3]) }}</td>
                  <td class="text-end pe-4 fw-bold text-danger">{{ formatPrice(row[1]) }}</td>
                </tr>
                <tr v-if="!stats.vipCustomers || stats.vipCustomers.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">Chưa có khách hàng VIP.</td>
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
import { ref, onMounted, nextTick } from 'vue';
import api from '@/api/index';
import Chart from 'chart.js/auto';

const isLoading = ref(true);
const currentYear = new Date().getFullYear();

// ==========================================
// ĐỊNH NGHĨA INTERFACE (FIX LỖI TS ĐỎ LÒM TRONG VS CODE)
// ==========================================
interface TopProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
}

interface StatsData {
  totalRevenue: number;
  successfulOrders: number;
  totalStock: number;
  newCustomersToday: number;
  chartData: number[];
  topProducts: TopProduct[]; 
  categoryStats: any[];
  vipCustomers: any[];
}

// Khởi tạo state chuẩn Type
const stats = ref<StatsData>({
  totalRevenue: 0,
  successfulOrders: 0,
  totalStock: 0,
  newCustomersToday: 0,
  chartData: [],
  topProducts: [],
  categoryStats: [],
  vipCustomers: []
});

// ==========================================
// GỌI API & FORMATTER
// ==========================================
const fetchStats = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/admin/dashboard-stats');
    stats.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu thống kê:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// ==========================================
// VẼ BIỂU ĐỒ (CHART.JS)
// ==========================================
const initChart = (chartData: number[]) => {
  const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: chartData,
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
        borderColor: '#0d6efd',
        borderWidth: 1,
        borderRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' ₫';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => new Intl.NumberFormat('vi-VN').format(Number(value)) + ' ₫'
          }
        }
      }
    }
  });
};

onMounted(async () => {
  await fetchStats();
  
  // Phải dùng nextTick để chắc chắn thẻ <canvas> đã có trên giao diện rồi mới vẽ
  await nextTick();
  if (stats.value.chartData && stats.value.chartData.length > 0) {
    initChart(stats.value.chartData);
  }
});
</script>

<style scoped>
/* Code HTML/Bootstrap của mày xịn quá rồi nên không cần chế thêm CSS */
</style>