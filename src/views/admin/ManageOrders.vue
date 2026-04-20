<template>
  <div class="admin-orders-page p-4 p-md-5">
    
    <div class="d-flex align-items-center mb-5">
      <div class="title-accent me-3"></div>
      <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Quản lý giao dịch</h3>
    </div>

    <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
      <div class="table-responsive">
        <table class="table luxury-table align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 py-4 text-uppercase letter-spacing-1">Mã Hóa Đơn</th>
              <th class="py-4 text-uppercase letter-spacing-1">Khách hàng & Thanh toán</th>
              <th class="py-4 text-uppercase letter-spacing-1">Thời gian lập</th>
              <th class="py-4 text-uppercase letter-spacing-1">Tổng cộng</th>
              <th class="py-4 text-uppercase letter-spacing-1">Tình trạng</th>
              <th class="text-end pe-4 py-4 text-uppercase letter-spacing-1">Xử lý</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" 
                @dblclick="viewOrderDetails(order)" 
                class="table-row-hover cursor-pointer" 
                title="Nháy đúp chuột để xem chi tiết hóa đơn">
              
              <td class="ps-4 fw-bold text-dark luxury-font fs-5">#{{ order.id }}</td>
              
              <td class="py-3">
                <div class="d-flex flex-column gap-1">
                  <span class="fw-bold text-dark fs-6">{{ order.fullName }}</span>
                  <span class="text-muted small"><i class="bi bi-telephone-fill me-2 gold-text opacity-75"></i>{{ order.phoneNumber }}</span>
                  <span class="text-muted small text-wrap line-clamp-2" style="max-width: 250px;">
                    <i class="bi bi-geo-alt-fill me-2 text-danger opacity-75"></i>{{ order.address || 'Chưa cập nhật địa chỉ' }}
                  </span>
                  
                  <div class="d-flex gap-2 mt-2 align-items-center flex-wrap">
                    <span class="badge-payment">
                      <i class="bi bi-credit-card-2-front me-1"></i>{{ order.paymentMethod }}
                    </span>
                    <span v-if="order.paymentStatus === 'Đã thanh toán'" class="badge-paid">
                      <i class="bi bi-check2-circle me-1"></i> Đã thanh toán
                    </span>
                    <span v-else class="badge-unpaid">
                      <i class="bi bi-clock-history me-1"></i> Chưa thu tiền
                    </span>
                  </div>
                </div>
              </td>
              
              <td class="text-muted small letter-spacing-1 py-3">{{ formatDate(order.orderDate) }}</td>
              
              <td class="fw-bold gold-text fs-5 luxury-font py-3">{{ formatPrice(order.totalPrice) }}</td>
              
              <td class="py-3">
                <span class="status-badge" :class="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              
              <td class="text-end pe-4 py-3" @dblclick.stop>
                <div class="d-flex justify-content-end gap-2 align-items-center">
                  
                  <button v-if="!['Chuyển khoản', 'BANK_TRANSFER', 'BANKING'].includes(order.paymentMethod) && order.paymentStatus !== 'Đã thanh toán' && order.status !== 'Đã hủy'" 
                          @click="confirmPayment(order.id)" 
                          class="btn btn-sm btn-outline-success action-btn shadow-sm" 
                          title="Xác nhận đã thu tiền mặt">
                    <i class="bi bi-cash-stack"></i>
                  </button>

                  <template v-if="order.status === 'Đang giao'">
                    <button @click="handleUpdateStatus(order.id, 'Hoàn thành', 'Khách hàng đã nhận được sản phẩm thành công?')" 
                            class="btn btn-sm btn-dark action-btn shadow-sm" title="Xác nhận Hoàn thành">
                      <i class="bi bi-check2-all"></i>
                    </button>
                  </template>
                  
                  <template v-else-if="order.status === 'Hoàn thành' || order.status === 'Đã hủy'">
                    </template>
                  
                  <template v-else>
                    <button @click="handleUpdateStatus(order.id, 'Đang giao', null)" 
                            class="btn btn-sm btn-gold shadow-sm action-btn border-0 text-dark" title="Tiến hành Giao hàng">
                      <i class="bi bi-truck"></i>
                    </button>
                    <button @click="handleUpdateStatus(order.id, 'Đã hủy', 'Cảnh báo: Quý khách có chắc chắn muốn HỦY giao dịch này?')" 
                            class="btn btn-sm btn-light border-gold-subtle text-danger action-btn shadow-sm hover-danger" title="Hủy đơn hàng">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </template>

                  <span v-if="order.status === 'Hoàn thành'" class="text-success ms-2"><i class="bi bi-shield-check fs-4"></i></span>
                  <span v-if="order.status === 'Đã hủy'" class="text-muted opacity-50 ms-2"><i class="bi bi-slash-circle fs-4"></i></span>
                  
                </div>
              </td>
            </tr>
            
            <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center py-5 text-muted fst-italic">Hệ thống đang tải danh sách giao dịch...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade luxury-modal" id="orderDetailModal" tabindex="-1" aria-hidden="true" ref="orderDetailModalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-1 shadow-lg">
          
          <div class="modal-header border-bottom border-gold-subtle bg-light px-4 py-3">
            <h5 class="modal-title luxury-font fw-bold text-uppercase letter-spacing-1 text-dark">
              <i class="bi bi-receipt gold-text me-2"></i>Chi tiết Hóa đơn 
              <span v-if="selectedOrder" class="text-muted ms-1">#{{ selectedOrder.id }}</span>
            </h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body p-4 p-md-5" v-if="selectedOrder">
            
            <div class="row mb-5 g-4">
              <div class="col-md-6 border-end-md border-gold-subtle pe-md-4">
                <h6 class="fw-bold text-muted text-uppercase small letter-spacing-1 mb-4 border-bottom pb-2">Thông tin người nhận</h6>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-person-fill gold-text me-3 fs-5"></i>
                  <strong class="text-dark fs-6">{{ selectedOrder.fullName }}</strong>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-telephone-fill gold-text me-3 fs-5 opacity-75"></i>
                  <span class="text-muted">{{ selectedOrder.phoneNumber }}</span>
                </div>
                <div class="d-flex align-items-start mt-3">
                  <i class="bi bi-geo-alt-fill text-danger me-3 fs-5 opacity-75"></i>
                  <span class="text-muted small lh-lg">{{ selectedOrder.address || 'Không có địa chỉ' }}</span>
                </div>
              </div>
              
              <div class="col-md-6 ps-md-4">
                <h6 class="fw-bold text-muted text-uppercase small letter-spacing-1 mb-4 border-bottom pb-2">Trạng thái Giao dịch</h6>
                <table class="table table-borderless table-sm small">
                  <tbody>
                    <tr>
                      <td class="text-muted">Thời gian lập:</td>
                      <td class="text-end fw-bold text-dark">{{ formatDate(selectedOrder.orderDate) }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">Hình thức:</td>
                      <td class="text-end"><span class="badge-payment">{{ selectedOrder.paymentMethod }}</span></td>
                    </tr>
                    <tr>
                      <td class="text-muted">Thanh toán:</td>
                      <td class="text-end">
                        <span v-if="selectedOrder.paymentStatus === 'Đã thanh toán'" class="gold-text fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Hoàn tất</span>
                        <span v-else class="text-danger fw-bold"><i class="bi bi-clock-history me-1"></i>Chưa thu tiền</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted pt-3">Tiến độ:</td>
                      <td class="text-end pt-3">
                        <span class="status-badge" :class="getStatusClass(selectedOrder.status)">{{ selectedOrder.status }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h6 class="fw-bold text-dark text-uppercase small letter-spacing-1 mb-3"><i class="bi bi-box-seam gold-text me-2"></i>Danh mục Tuyệt tác</h6>
            <div class="table-responsive border border-gold-subtle rounded-1">
              <table class="table luxury-table align-middle mb-0">
                <thead class="bg-light">
                  <tr>
                    <th class="ps-3 text-uppercase letter-spacing-1 border-0">Sản phẩm</th>
                    <th class="text-center text-uppercase letter-spacing-1 border-0">Đơn giá</th>
                    <th class="text-center text-uppercase letter-spacing-1 border-0">SL</th>
                    <th class="text-end pe-3 text-uppercase letter-spacing-1 border-0">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in selectedOrder.orderDetails" :key="idx" class="border-bottom border-dashed">
                    <td class="ps-3 py-3">
                      <div class="d-flex align-items-center">
                        <div class="img-wrap border-gold-subtle p-1 bg-white me-3" style="width: 50px; height: 50px;">
                          <img :src="getImageUrl(item.imageUrl)" class="img-fluid w-100 h-100 object-fit-contain mix-blend-multiply" @error="handleImageError">
                        </div>
                        <div class="d-flex flex-column align-items-start">
                          <span class="fw-bold text-dark small" style="max-width: 200px;">{{ item.productName }}</span>
                          <span v-if="item.discount && item.discount > 0" class="badge-sale mt-1">
                            Khuyến mãi: -{{ item.discount }}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center text-muted small">{{ formatPrice(item.price) }}</td>
                    <td class="text-center fw-bold text-dark">{{ item.quantity }}</td>
                    <td class="text-end pe-3 fw-bold gold-text">{{ formatPrice(item.price * item.quantity) }}</td>
                  </tr>
                  
                  <tr v-if="!selectedOrder.orderDetails || selectedOrder.orderDetails.length === 0">
                    <td colspan="4" class="text-center py-4 text-muted fst-italic">Không tải được chi tiết tuyệt tác.</td>
                  </tr>
                </tbody>
                
                <tfoot class="bg-light border-top border-gold-subtle">
                  <tr>
                    <td colspan="3" class="text-end fw-bold text-dark py-4 text-uppercase letter-spacing-1 small">Giá trị Hóa đơn:</td>
                    <td class="text-end pe-3 fw-bold text-danger fs-4 luxury-font py-4">{{ formatPrice(selectedOrder.totalPrice) }}</td>
                  </tr>
                </tfoot>
                
              </table>
            </div>
            
          </div>
          
          <div class="modal-footer bg-light border-top border-gold-subtle px-4 py-3">
            <button type="button" class="btn btn-outline-secondary rounded-1 px-5 py-2 fw-bold text-uppercase letter-spacing-1" data-bs-dismiss="modal">Đóng hồ sơ</button>
          </div>
          
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/index';
// @ts-ignore
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2'; // CHỈ THÊM DÒNG NÀY

// CẤU HÌNH POPUP LUXURY
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1',
    cancelButton: 'btn btn-outline-secondary rounded-1 fw-bold px-4 py-2 ms-2 text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

interface OrderDetail {
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  discount?: number; 
}

interface Order {
  id: number;
  fullName: string;
  phoneNumber: string;
  address?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  orderDetails?: OrderDetail[];
}

const orders = ref<Order[]>([]);

const orderDetailModalRef = ref(null);
let orderDetailModalInstance: any = null;
const selectedOrder = ref<Order | null>(null);

const fetchOrders = async () => {
  try {
    const res = await api.get<Order[]>('/admin/orders');
    orders.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error);
  }
};

onMounted(() => {
  fetchOrders();
  if (orderDetailModalRef.value) {
    orderDetailModalInstance = new Modal(orderDetailModalRef.value);
  }
});

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order;
  if (orderDetailModalInstance) {
    orderDetailModalInstance.show();
  }
};

const getImageUrl = (img: string) => {
  if (!img) return 'https://via.placeholder.com/45';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/45';
};

const formatPrice = (val: number) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const handleUpdateStatus = async (orderId: number, newStatus: string, confirmMsg: string | null) => {
  // SỬA ĐỔI 1: Thay thế confirm()
  if (confirmMsg) {
    const result = await LuxuryAlert.fire({
      icon: 'question',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Xác nhận</h4>',
      text: confirmMsg,
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ'
    });
    if (!result.isConfirmed) return;
  }

  try {
    await api.post('/admin/orders/update-status', { orderId, status: newStatus });
    await fetchOrders(); 
    
    // Tùy chọn: Thêm Toast mượt mà báo thành công (Bỏ qua nếu không cần)
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cập nhật thành công!', showConfirmButton: false, timer: 2000 });
  } catch (error) {
    // SỬA ĐỔI 2: Thay thế alert()
    LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Cập nhật trạng thái thất bại!' });
  }
};

const confirmPayment = async (orderId: number) => {
  // SỬA ĐỔI 3: Thay thế confirm()
  const result = await LuxuryAlert.fire({
    icon: 'question',
    title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Xác nhận thu tiền</h4>',
    text: 'Xác nhận ĐÃ THU TIỀN MẶT thành công từ giao dịch này?',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy bỏ'
  });

  if (result.isConfirmed) {
    try {
      await api.post('/admin/orders/confirm-payment', { orderId }); 
      await fetchOrders(); 
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã xác nhận thanh toán!', showConfirmButton: false, timer: 2000 });
    } catch (error) {
      // SỬA ĐỔI 4: Thay thế alert()
      LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi xác nhận thanh toán!' });
    }
  }
};

// Hàm phụ trợ tạo Class CSS cho Badges Trạng thái
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Hoàn thành': return 'status-success';
    case 'Đang giao': return 'status-info';
    case 'Chờ xác nhận': return 'status-pending';
    case 'Đã hủy': return 'status-danger';
    default: return 'status-default';
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN ORDERS
========================================== */
.admin-orders-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.text-danger { color: #8b0000 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.border-dashed { border-bottom: 1px dashed #e0e0e0 !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }

/* Bảng Dữ liệu (Table) */
.luxury-table { margin-bottom: 0; }
.luxury-table thead { background-color: #fafafa; border-bottom: 1px solid #eaeaea; }
.luxury-table th { 
  font-size: 11px; color: #888; font-weight: 700; 
  padding: 15px 10px; border-bottom: none;
}
.luxury-table td { padding: 15px 10px; color: #444; border-bottom: 1px solid #f9f9f9; vertical-align: middle; }

.table-row-hover { transition: all 0.2s ease; background-color: #fff; }
.table-row-hover:hover { background-color: #fdfbf7; }
.cursor-pointer { cursor: pointer; }

/* Badges (Payment & Status) */
.badge-payment {
  background: #fafafa; color: #111; border: 1px solid #eaeaea;
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  padding: 4px 8px; border-radius: 2px; letter-spacing: 1px;
}
.badge-paid { background: #e6f2e6; color: #1a661a; border: 1px solid #99cc99; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 2px; }
.badge-unpaid { background: #fff5f5; color: #cc0000; border: 1px solid #ffcccc; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 2px; }

.status-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 10px; border-radius: 2px; }
.status-success { background: #e6f2e6; color: #1a661a; border: 1px solid #99cc99; }
.status-info { background: #1a1a1a; color: #D4AF37; border: 1px solid #333; }
.status-pending { background: #fff5e6; color: #b37700; border: 1px solid #ffd699; }
.status-danger { background: #fff0f0; color: #cc0000; border: 1px solid #ffcccc; }
.status-default { background: #f5f5f5; color: #666; border: 1px solid #ddd; }

.badge-sale { background: #8b0000; color: #fff; padding: 2px 6px; font-size: 10px; font-weight: bold; border-radius: 2px; }

/* Nút Tác vụ (Action Buttons) */
.action-btn { 
  border-radius: 2px; padding: 5px 12px; transition: 0.3s; 
  display: flex; align-items: center; justify-content: center;
}
.action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

.btn-gold { background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%); }
.btn-gold:hover { background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%); }

.hover-danger:hover { background: #fff5f5 !important; border-color: #8b0000 !important; color: #8b0000 !important; }

/* Tiện ích */
.border-end-md { border-right: none; }
@media (min-width: 768px) {
  .border-end-md { border-right: 1px solid #eaeaea; }
}
.mix-blend-multiply { mix-blend-mode: multiply; }
</style>