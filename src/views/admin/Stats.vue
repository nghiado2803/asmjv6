<template>
  <div class="admin-stats-page p-4 p-md-5">
    
    <div class="d-flex align-items-center mb-5">
      <div class="title-accent me-3"></div>
      <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Báo cáo Kinh doanh</h3>
    </div>

    <div class="row g-4 mb-5">
      
      <div class="col-md-3">
        <div class="card luxury-stat-card bg-dark-gradient text-white h-100 border-0 shadow-sm">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <h6 class="text-uppercase small fw-bold letter-spacing-1 text-gold-light mb-3">Tổng doanh thu</h6>
            <h3 class="fw-bold luxury-font text-white mb-3">{{ formatPrice(stats.totalRevenue) }}</h3>
            <small class="text-white-50 letter-spacing-1"><i class="bi bi-graph-up-arrow me-1"></i> Tích lũy toàn hệ thống</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card luxury-stat-card bg-white h-100 border-gold-subtle shadow-sm">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <h6 class="text-muted text-uppercase small fw-bold letter-spacing-1 mb-3">Giao dịch thành công</h6>
            <h3 class="fw-bold text-dark luxury-font mb-3">{{ stats.successfulOrders || 0 }} <span class="fs-6 fw-normal text-muted">đơn</span></h3>
            <small class="text-success fw-bold letter-spacing-1"><i class="bi bi-check2-all me-1"></i> Đã giao & Thanh toán</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card luxury-stat-card bg-white h-100 border-gold-subtle shadow-sm">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <h6 class="text-muted text-uppercase small fw-bold letter-spacing-1 mb-3">Tổng tồn kho</h6>
            <h3 class="fw-bold text-dark luxury-font mb-3">{{ stats.totalStock || 0 }} <span class="fs-6 fw-normal text-muted">sản phẩm</span></h3>
            <small class="gold-text fw-bold letter-spacing-1"><i class="bi bi-box-seam me-1"></i> Sẵn sàng phục vụ</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card luxury-stat-card bg-white h-100 border-gold-subtle shadow-sm">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <h6 class="text-muted text-uppercase small fw-bold letter-spacing-1 mb-3">Khách hàng mới</h6>
            <h3 class="fw-bold text-dark luxury-font mb-3">{{ stats.newCustomersToday || 0 }} <span class="fs-6 fw-normal text-muted">người</span></h3>
            <small class="text-muted fw-bold letter-spacing-1"><i class="bi bi-person-plus me-1"></i> Đăng ký trong ngày</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      
      <div class="col-md-8">
        <div class="card border-gold-subtle shadow-sm rounded-1 h-100 bg-white">
          <div class="card-header bg-transparent py-4 px-4 border-bottom border-gold-subtle">
            <h6 class="fw-bold mb-0 text-uppercase letter-spacing-1 text-dark"><i class="bi bi-bar-chart-line-fill gold-text me-2 fs-5"></i>Biểu đồ doanh thu năm {{ currentYear }}</h6>
          </div>
          <div class="card-body p-4">
            <div style="height: 380px;" v-if="!isLoading">
              <canvas id="revenueChart"></canvas>
            </div>
            <div v-else class="d-flex justify-content-center align-items-center h-100 flex-column text-muted">
              <div class="spinner-border gold-text mb-3"></div>
              <span class="text-uppercase letter-spacing-1 small fw-bold">Đang vẽ biểu đồ...</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-gold-subtle shadow-sm rounded-1 h-100 bg-white">
          <div class="card-header bg-transparent py-4 px-4 border-bottom border-gold-subtle">
            <h6 class="fw-bold mb-0 text-uppercase letter-spacing-1 text-dark"><i class="bi bi-award-fill gold-text me-2 fs-5"></i>Top giá trị cao nhất</h6>
          </div>
          
          <ul class="list-group list-group-flush" v-if="stats.topProducts && stats.topProducts.length > 0">
            <li v-for="(p, index) in stats.topProducts" :key="p.id" class="list-group-item border-0 border-bottom border-dashed px-4 py-3 d-flex justify-content-between align-items-center table-row-hover">
              <div class="d-flex align-items-center">
                <span class="badge-rank me-3 shadow-sm d-flex align-items-center justify-content-center" 
                      :class="index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : 'rank-other'))">
                  {{ index + 1 }}
                </span>
                <div>
                  <span class="fw-bold d-block text-truncate text-dark luxury-font" style="max-width: 140px; font-size: 15px;">{{ p.name }}</span>
                  <small class="text-muted text-uppercase letter-spacing-1" style="font-size: 10px;">{{ p.brand }}</small>
                </div>
              </div>
              <span class="fw-bold gold-text small letter-spacing-1">{{ formatPrice(p.price) }}</span>
            </li>
          </ul>

          <div v-else class="card-body text-center text-muted d-flex flex-column align-items-center justify-content-center fst-italic" style="min-height: 250px;">
            <i class="bi bi-inbox display-4 opacity-25 mb-3"></i>
            <p class="mb-0 small letter-spacing-1">Chưa có dữ liệu tuyệt tác.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
          <div class="card-header bg-transparent py-4 px-4 border-bottom border-gold-subtle">
            <h6 class="fw-bold mb-0 text-uppercase letter-spacing-1 text-dark"><i class="bi bi-tags gold-text me-2 fs-5"></i>Tỷ trọng Phân loại</h6>
          </div>
          <div class="table-responsive">
            <table class="table luxury-table align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4 text-uppercase letter-spacing-1">Bộ sưu tập</th>
                  <th class="text-center text-uppercase letter-spacing-1">Số lượng bán</th>
                  <th class="text-uppercase letter-spacing-1">Phân khúc thấp</th>
                  <th class="text-uppercase letter-spacing-1">Phân khúc cao</th>
                  <th class="text-uppercase letter-spacing-1">Mức giá TB</th>
                  <th class="text-end pe-4 text-uppercase letter-spacing-1">Tổng sinh lời</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in stats.categoryStats" :key="index" class="table-row-hover">
                  <td class="ps-4 fw-bold text-dark luxury-font fs-6">{{ row[0] }}</td>
                  <td class="text-center fw-bold">{{ row[2] }}</td>
                  <td class="text-muted small">{{ formatPrice(row[3]) }}</td>
                  <td class="text-muted small">{{ formatPrice(row[4]) }}</td>
                  <td class="text-muted small">{{ formatPrice(row[5]) }}</td>
                  <td class="text-end pe-4 fw-bold gold-text">{{ formatPrice(row[1]) }}</td>
                </tr>
                <tr v-if="!stats.categoryStats || stats.categoryStats.length === 0">
                  <td colspan="6" class="text-center py-5 text-muted fst-italic">Hệ thống chưa ghi nhận dữ liệu bán hàng.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
          <div class="card-header bg-transparent py-4 px-4 border-bottom border-gold-subtle d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0 text-uppercase letter-spacing-1 text-dark"><i class="bi bi-gem gold-text me-2 fs-5"></i>Top 10 Đối tác VIP</h6>
            <span class="badge-vip"><i class="bi bi-star-fill me-1"></i>Chi tiêu cao nhất</span>
          </div>
          <div class="table-responsive">
            <table class="table luxury-table align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4 text-uppercase letter-spacing-1" style="width: 80px;">Hạng</th>
                  <th class="text-uppercase letter-spacing-1">Tên khách hàng</th>
                  <th class="text-uppercase letter-spacing-1">Khách từ</th>
                  <th class="text-uppercase letter-spacing-1">Giao dịch cuối</th>
                  <th class="text-end pe-4 text-uppercase letter-spacing-1">Lũy kế mua hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in stats.vipCustomers" :key="i" class="table-row-hover">
                  <td class="ps-4">
                    <span class="badge-rank shadow-sm d-flex align-items-center justify-content-center mx-auto"
                          :class="i === 0 ? 'rank-1' : (i === 1 ? 'rank-2' : (i === 2 ? 'rank-3' : 'rank-other'))">
                      {{ i + 1 }}
                    </span>
                  </td>
                  <td class="fw-bold text-dark luxury-font fs-6">{{ row[0] }}</td>
                  <td class="text-muted small letter-spacing-1">{{ formatDate(row[2]) }}</td>
                  <td class="text-muted small letter-spacing-1">{{ formatDate(row[3]) }}</td>
                  <td class="text-end pe-4 fw-bold gold-text fs-5 luxury-font">{{ formatPrice(row[1]) }}</td>
                </tr>
                <tr v-if="!stats.vipCustomers || stats.vipCustomers.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted fst-italic">Hệ thống chưa ghi nhận khách hàng VIP.</td>
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
// INTERFACES
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
// API & FORMATTER
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
// CHART.JS (LUXURY STYLE)
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
        backgroundColor: 'rgba(212, 175, 55, 0.75)', // Màu Vàng Gold (Cột trong biểu đồ)
        hoverBackgroundColor: 'rgba(212, 175, 55, 1)',
        borderColor: '#B38728',
        borderWidth: 1,
        borderRadius: 2, // Hơi vuông một chút cho sang
        barPercentage: 0.6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          titleFont: { family: "'Helvetica Neue', Arial, sans-serif", size: 13, weight: 'bold' },
          bodyFont: { family: "'Helvetica Neue', Arial, sans-serif", size: 14 },
          padding: 12,
          borderColor: '#D4AF37',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              if (context.parsed.y !== null) {
                return ' ' + new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' ₫';
              }
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Helvetica Neue', Arial, sans-serif", weight: 'bold' }, color: '#888' }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#eaeaea', tickLength: 0 },
          border: { display: false },
          ticks: {
            font: { family: "'Helvetica Neue', Arial, sans-serif" },
            color: '#aaa',
            padding: 10,
            callback: (value) => {
              if (Number(value) >= 1000000000) return (Number(value) / 1000000000) + ' Tỷ';
              if (Number(value) >= 1000000) return (Number(value) / 1000000) + ' Tr';
              return new Intl.NumberFormat('vi-VN').format(Number(value));
            }
          }
        }
      }
    }
  });
};

onMounted(async () => {
  await fetchStats();
  await nextTick();
  if (stats.value.chartData && stats.value.chartData.length > 0) {
    initChart(stats.value.chartData);
  }
});
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN STATS
========================================== */
.admin-stats-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.luxury-font { font-family: 'Montserrat', sans-serif;}
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.text-gold-light { color: #FBF5B7 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.border-dashed { border-bottom: 1px dashed #eaeaea !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }

/* Thẻ Thống kê (Stat Cards) */
.luxury-stat-card {
  border-radius: 2px; 
  transition: all 0.4s ease;
}
.luxury-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.06) !important;
  border-color: #D4AF37 !important;
}
.bg-dark-gradient {
  background: linear-gradient(135deg, #111 0%, #2a2a2a 100%);
}

/* Bảng Dữ liệu (Table) */
.luxury-table { margin-bottom: 0; }
.luxury-table thead { background-color: #fafafa; border-bottom: 1px solid #eaeaea; }
.luxury-table th { 
  font-size: 10px; color: #888; font-weight: 700; 
  padding: 18px 10px; border-bottom: none;
}
.luxury-table td { padding: 18px 10px; color: #444; border-bottom: 1px solid #f9f9f9; vertical-align: middle; }
.table-row-hover { transition: all 0.2s ease; background-color: #fff; }
.table-row-hover:hover { background-color: #fdfbf7; }

/* Badges VIP / Rank */
.badge-vip {
  background: #fdfbf7; color: #B38728; border: 1px solid #D4AF37;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  padding: 5px 12px; border-radius: 2px;
}

.badge-rank {
  width: 28px; height: 28px; border-radius: 2px;
  font-weight: 800; font-size: 12px; font-family: 'Montserrat', sans-serif;
}
.rank-1 { background: linear-gradient(135deg, #D4AF37, #B38728); color: #fff; border: 1px solid #AA771C; }
.rank-2 { background: linear-gradient(135deg, #e0e0e0, #999); color: #fff; border: 1px solid #888; }
.rank-3 { background: linear-gradient(135deg, #cd7f32, #a65e2e); color: #fff; border: 1px solid #8B4513; }
.rank-other { background: #fafafa; color: #555; border: 1px solid #eaeaea; }
</style>