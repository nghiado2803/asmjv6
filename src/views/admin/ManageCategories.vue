<template>
  <div class="admin-categories-page p-4 p-md-5">
    
    <div class="d-flex align-items-center mb-5">
      <div class="title-accent me-3"></div>
      <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Quản lý phân loại</h3>
    </div>

    <div v-if="errorMessage" class="alert custom-alert-danger shadow-sm rounded-1 mb-4 d-flex align-items-center">
      <i class="bi bi-exclamation-triangle-fill fs-5 me-3"></i>
      <span class="fw-bold letter-spacing-1 small text-uppercase">{{ errorMessage }}</span>
      <button type="button" class="btn-close ms-auto shadow-none" @click="errorMessage = ''"></button>
    </div>

    <div v-if="successMessage" class="alert custom-alert-success shadow-sm rounded-1 mb-4 d-flex align-items-center">
      <i class="bi bi-check-circle-fill fs-5 me-3"></i>
      <span class="fw-bold letter-spacing-1 small text-uppercase">{{ successMessage }}</span>
      <button type="button" class="btn-close ms-auto shadow-none" @click="successMessage = ''"></button>
    </div>

    <div class="row g-5">
      
      <div class="col-md-4">
        <div class="card border-gold-subtle shadow-sm rounded-1 sticky-top bg-white" style="top: 100px; z-index: 1;">
          <div class="card-header bg-transparent py-4 border-bottom border-gold-subtle">
            <h6 class="luxury-font fw-bold mb-0 text-dark text-uppercase letter-spacing-1">
              <i :class="form.id ? 'bi bi-pencil-square gold-text' : 'bi bi-plus-square gold-text'" class="me-2 fs-5"></i>
              <span>{{ form.id ? 'Cập nhật phân loại' : 'Tạo mới phân loại' }}</span>
            </h6>
          </div>
          <div class="card-body p-4 p-lg-5">
            <form @submit.prevent="saveCategory">
              <div class="mb-4">
                <label class="form-label fw-bold small text-muted text-uppercase letter-spacing-1">Tên danh mục</label>
                <input type="text" v-model="form.name" class="form-control custom-input py-2" placeholder="Ví dụ: Đồng hồ Nam..." required>
              </div>
              <div class="d-grid gap-3 mt-5">
                <button type="submit" class="btn btn-gold rounded-1 fw-bold shadow-sm py-2 text-uppercase letter-spacing-1" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  <span v-else><i class="bi bi-check2-circle me-2"></i>{{ isSubmitting ? 'Đang xử lý...' : 'Lưu hồ sơ' }}</span>
                </button>
                <button type="button" v-if="form.id" @click="resetForm" class="btn btn-outline-secondary rounded-1 fw-bold text-uppercase letter-spacing-1 py-2">
                  Hủy thao tác
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
          <div class="card-body p-0">
            
            <div v-if="isLoading" class="text-center py-5 my-5 text-muted">
              <div class="spinner-border gold-text" role="status"></div>
              <p class="mt-3 fw-bold text-uppercase letter-spacing-1 small">Đang tải cấu trúc dữ liệu...</p>
            </div>

            <table v-else class="table luxury-table align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4 border-0 text-uppercase letter-spacing-1">ID Định danh</th>
                  <th class="border-0 text-uppercase letter-spacing-1">Tên danh mục</th>
                  <th class="border-0 text-center text-uppercase letter-spacing-1">Số lượng mẫu</th>
                  <th class="text-end pe-4 border-0 text-uppercase letter-spacing-1">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in categories" :key="cat.id!" class="table-row-hover">
                  <td class="ps-4 fw-bold text-muted">#{{ cat.id }}</td>
                  <td class="fw-bold text-dark luxury-font fs-6">{{ cat.name }}</td>
                  
                  <td class="text-center">
                    <span class="badge-count">
                      <strong class="gold-text fs-6 me-1">{{ cat.productCount || 0 }}</strong> 
                      <span class="text-muted small fw-normal">Sản phẩm</span>
                    </span>
                  </td>

                  <td class="text-end pe-4">
                    <div class="btn-group shadow-sm">
                      <button @click="editCategory(cat)" class="btn btn-sm btn-light border-gold-subtle action-btn text-dark" title="Chỉnh sửa">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button @click="cat.id && handleDelete(cat.id)" class="btn btn-sm btn-light border-gold-subtle action-btn text-danger hover-danger" title="Xóa">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="categories.length === 0">
                  <td colspan="4" class="text-center py-5 text-muted">
                    <i class="bi bi-tags display-4 gold-text opacity-25 d-block mb-3"></i>
                    <span class="fst-italic">Hệ thống chưa có danh mục nào.</span>
                  </td>
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
import { ref, reactive, onMounted } from 'vue';
import api from '@/api/index';
import Swal from 'sweetalert2'; // CHỈ THÊM DÒNG NÀY

// CẤU HÌNH POPUP LUXURY
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1',
    cancelButton: 'btn btn-outline-secondary rounded-1 fw-bold px-4 py-2 ms-2 text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

// Interface chuẩn
interface Category {
  id: number | null;
  name: string;
  productCount?: number; // Thêm trường này để mapping với API mới
}

const categories = ref<Category[]>([]);
const isSubmitting = ref(false);
const isLoading = ref(true);

// State quản lý thông báo (Thay cho param.error và param.success bên Thymeleaf)
const errorMessage = ref('');
const successMessage = ref('');

const form = reactive<Category>({
  id: null,
  name: ''
});

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const res = await api.get<Category[]>('/admin/categories');
    categories.value = res.data;
  } catch (e) {
    console.error(e);
    errorMessage.value = "Lỗi khi lấy dữ liệu danh mục.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCategories);

const resetForm = () => {
  form.id = null;
  form.name = '';
  errorMessage.value = '';
  successMessage.value = '';
};

const editCategory = (cat: Category) => {
  form.id = cat.id;
  form.name = cat.name;
  errorMessage.value = '';
  successMessage.value = '';
};

const saveCategory = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    await api.post('/admin/categories', form);
    successMessage.value = form.id ? "Cập nhật danh mục thành công!" : "Thêm danh mục thành công!";
    resetForm();
    await fetchCategories();
  } catch (error) {
    errorMessage.value = "Có lỗi xảy ra khi lưu danh mục.";
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  // SỬA ĐỔI DUY NHẤT: Thay thế confirm() mặc định bằng SweetAlert2
  const result = await LuxuryAlert.fire({
    icon: 'warning',
    title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Cảnh báo</h4>',
    text: 'Bạn có chắc chắn muốn xóa danh mục này?',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận xóa',
    cancelButtonText: 'Hủy bỏ'
  });

  if (result.isConfirmed) {
    errorMessage.value = '';
    successMessage.value = '';
    try {
      await api.delete(`/admin/categories/${id}`);
      successMessage.value = "Đã xóa danh mục thành công.";
      await fetchCategories();
    } catch (err: any) {
      // [LOGIC ĐÃ THÊM]: Bắt đúng lỗi không cho xóa nếu có sản phẩm bên trong
      errorMessage.value = err.response?.data?.message || "Không thể xóa danh mục này vì đang có tuyệt tác bên trong!";
    }
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN CATEGORIES
========================================== */
.admin-categories-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }

/* Alerts */
.custom-alert-success { background: #fdfbf7; border-left: 4px solid #D4AF37 !important; color: #B38728; }
.custom-alert-danger { background: #fff5f5; border-left: 4px solid #8b0000 !important; color: #8b0000; }

/* Bảng Dữ liệu (Table) */
.luxury-table { margin-bottom: 0; }
.luxury-table thead { background-color: #fafafa; }
.luxury-table th { 
  font-size: 11px; color: #888; font-weight: 700; 
  padding: 18px 10px; border-bottom: 1px solid #eaeaea;
}
.luxury-table td { padding: 18px 10px; color: #444; border-bottom: 1px solid #f9f9f9; vertical-align: middle; }
.table-row-hover { transition: all 0.2s ease; background-color: #fff; }
.table-row-hover:hover { background-color: #fdfbf7; }

/* Badges & Inputs */
.badge-count {
  display: inline-block;
  background: #fafafa;
  border: 1px solid #eaeaea;
  padding: 5px 15px;
  border-radius: 2px;
}

.custom-input { 
  border: 1px solid #e0e0e0; border-radius: 2px; 
  padding: 12px 15px; font-size: 14px; background: #fafafa; 
  transition: all 0.3s; box-shadow: none; color: #333;
}
.custom-input:focus { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); outline: none; }

/* Nút Submit (Gold Gradient) */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37;
  transition: all 0.4s ease;
}
.btn-gold:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

/* Nút Hành động trong bảng */
.action-btn { border-radius: 0; padding: 5px 12px; background: #fff; transition: 0.3s; }
.action-btn:hover { background: #fdfbf7; border-color: #D4AF37; color: #D4AF37 !important; }
.hover-danger:hover { background: #fff5f5; border-color: #8b0000; color: #8b0000 !important; }
</style>