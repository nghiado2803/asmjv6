<template>
  <div class="container-fluid p-4">
    <h3 class="fw-bold text-dark mb-4">Quản lý Đơn hàng</h3>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light text-secondary">
            <tr>
              <th class="ps-4">Mã đơn</th>
              <th>Khách hàng & Thanh toán</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái giao hàng</th>
              <th class="text-end pe-4">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" 
                @dblclick="viewOrderDetails(order)" 
                class="cursor-pointer" 
                title="Nháy đúp chuột để xem chi tiết đơn hàng">
              
              <td class="ps-4 fw-bold text-primary">#{{ order.id }}</td>
              
              <td>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-dark">{{ order.fullName }}</span>
                  <small class="text-muted"><i class="bi bi-telephone me-1"></i>{{ order.phoneNumber }}</small>
                  <small class="text-muted text-wrap" style="max-width: 200px;">
                    <i class="bi bi-geo-alt me-1"></i>{{ order.address || 'Đang cập nhật' }}
                  </small>
                  
                  <div class="mt-2">
                    <span class="badge bg-light text-dark border me-1">
                      <i class="bi bi-credit-card me-1"></i>{{ order.paymentMethod }}
                    </span>
                    <span v-if="order.paymentStatus === 'Đã thanh toán'" class="badge bg-success bg-opacity-25 text-success border border-success">
                      <i class="bi bi-check-circle-fill"></i> Đã thanh toán
                    </span>
                    <span v-else class="badge bg-danger bg-opacity-10 text-danger border border-danger">
                      Chưa thanh toán
                    </span>
                  </div>
                </div>
              </td>
              
              <td class="small">{{ formatDate(order.orderDate) }}</td>
              
              <td class="fw-bold text-danger">{{ formatPrice(order.totalPrice) }}</td>
              
              <td>
                <span v-if="order.status === 'Đang giao'" class="badge bg-info text-white border border-info">Đang giao</span>
                <span v-else-if="order.status === 'Hoàn thành'" class="badge bg-success border border-success">Hoàn thành</span>
                <span v-else-if="order.status === 'Đã hủy'" class="badge bg-danger border border-danger">Đã hủy</span>
                <span v-else class="badge bg-warning text-dark border border-warning">Chờ xác nhận</span>
              </td>
              
              <td class="text-end pe-4" @dblclick.stop>
                <div class="d-flex justify-content-end gap-2 align-items-center">
                  
                  <button v-if="!['Chuyển khoản', 'BANK_TRANSFER', 'BANKING'].includes(order.paymentMethod) && order.paymentStatus !== 'Đã thanh toán' && order.status !== 'Đã hủy'" 
                          @click="confirmPayment(order.id)" 
                          class="btn btn-sm btn-success fw-bold shadow-sm" 
                          title="Xác nhận đã thu tiền mặt">
                    <i class="bi bi-cash-coin me-1"></i>Nhận tiền
                  </button>

                  <template v-if="order.status === 'Đang giao'">
                    <button @click="handleUpdateStatus(order.id, 'Hoàn thành', 'Xác nhận giao hàng thành công?')" class="btn btn-sm btn-outline-primary shadow-sm" title="Hoàn thành">
                      <i class="bi bi-check2-circle"></i> Xong
                    </button>
                  </template>
                  
                  <template v-else-if="order.status === 'Hoàn thành' || order.status === 'Đã hủy'">
                    </template>
                  
                  <template v-else>
                    <button @click="handleUpdateStatus(order.id, 'Đang giao', null)" class="btn btn-sm btn-primary shadow-sm" title="Giao hàng">
                      <i class="bi bi-truck"></i>
                    </button>
                    <button @click="handleUpdateStatus(order.id, 'Đã hủy', 'Bạn có chắc chắn muốn HỦY đơn hàng này?')" class="btn btn-sm btn-light text-danger shadow-sm ms-1" title="Hủy">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </template>

                  <span v-if="order.status === 'Hoàn thành'" class="text-success small fw-bold ms-2"><i class="bi bi-bag-check-fill fs-5"></i></span>
                  <span v-if="order.status === 'Đã hủy'" class="text-muted small ms-2"><i class="bi bi-x-octagon-fill fs-5"></i></span>
                </div>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">Đang tải danh sách đơn hàng...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-hidden="true" ref="orderDetailModalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
          <div class="modal-header border-bottom bg-light rounded-top-4">
            <h5 class="modal-title fw-bold text-primary">
              <i class="bi bi-receipt me-2"></i>Chi tiết hóa đơn <span v-if="selectedOrder" class="text-dark">#{{ selectedOrder.id }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body p-4" v-if="selectedOrder">
            <div class="row mb-4">
              <div class="col-md-6 border-end">
                <h6 class="fw-bold text-muted text-uppercase small mb-3">Thông tin nhận hàng</h6>
                <p class="mb-1"><i class="bi bi-person-fill me-2 text-primary"></i><strong>{{ selectedOrder.fullName }}</strong></p>
                <p class="mb-1"><i class="bi bi-telephone-fill me-2 text-success"></i>{{ selectedOrder.phoneNumber }}</p>
                <p class="mb-1 text-wrap"><i class="bi bi-geo-alt-fill me-2 text-danger"></i>{{ selectedOrder.address || 'Không có địa chỉ' }}</p>
              </div>
              <div class="col-md-6 ps-4">
                <h6 class="fw-bold text-muted text-uppercase small mb-3">Thông tin giao dịch</h6>
                <p class="mb-1"><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.orderDate) }}</p>
                <p class="mb-1"><strong>Thanh toán:</strong> <span class="badge bg-light text-dark border">{{ selectedOrder.paymentMethod }}</span></p>
                <p class="mb-1"><strong>Trạng thái:</strong> 
                  <span v-if="selectedOrder.paymentStatus === 'Đã thanh toán'" class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Đã thanh toán</span>
                  <span v-else class="text-danger fw-bold"><i class="bi bi-x-circle-fill me-1"></i>Chưa thanh toán</span>
                </p>
              </div>
            </div>

            <h6 class="fw-bold text-muted text-uppercase small mb-3">Danh sách sản phẩm</h6>
            <div class="table-responsive border rounded-3">
              <table class="table table-borderless align-middle mb-0">
                <thead class="bg-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th class="text-center">Đơn giá</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-end pe-3">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in selectedOrder.orderDetails" :key="idx" class="border-bottom">
                    <td>
                      <div class="d-flex align-items-center">
                        <img :src="getImageUrl(item.imageUrl)" class="rounded border bg-white" style="width: 45px; height: 45px; object-fit: contain;" @error="handleImageError">
                        <div class="ms-3 d-flex flex-column align-items-start">
                          <span class="fw-bold text-dark" style="max-width: 250px;">{{ item.productName }}</span>
                          <span v-if="item.discount && item.discount > 0" class="badge bg-danger mt-1" style="font-size: 0.7rem;">
                            Khuyến mãi: -{{ item.discount }}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center text-muted">{{ formatPrice(item.price) }}</td>
                    <td class="text-center fw-bold">{{ item.quantity }}</td>
                    <td class="text-end pe-3 fw-bold text-danger">{{ formatPrice(item.price * item.quantity) }}</td>
                  </tr>
                  <tr v-if="!selectedOrder.orderDetails || selectedOrder.orderDetails.length === 0">
                    <td colspan="4" class="text-center py-3 text-muted">Không tải được chi tiết sản phẩm.</td>
                  </tr>
                </tbody>
                <tfoot class="bg-light">
                  <tr>
                    <td colspan="3" class="text-end fw-bold text-dark pt-3">TỔNG CỘNG:</td>
                    <td class="text-end pe-3 fw-bold text-danger fs-5 pt-3">{{ formatPrice(selectedOrder.totalPrice) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer bg-light border-top-0">
            <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
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

// Đã bổ sung trường discount vào OrderDetail
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
  if (confirmMsg && !confirm(confirmMsg)) return;
  try {
    await api.post('/admin/orders/update-status', { orderId, status: newStatus });
    await fetchOrders(); 
  } catch (error) {
    alert("Cập nhật trạng thái thất bại!");
  }
};

const confirmPayment = async (orderId: number) => {
  if (confirm('Xác nhận đã thu tiền mặt từ khách hàng này?')) {
    try {
      await api.post('/admin/orders/confirm-payment', { orderId }); 
      await fetchOrders(); 
    } catch (error) {
      alert("Lỗi xác nhận thanh toán!");
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.table-hover tbody tr.cursor-pointer:hover {
  background-color: rgba(13, 110, 253, 0.04);
}
</style>