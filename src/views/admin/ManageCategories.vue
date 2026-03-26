<template>
  <div class="container-fluid p-4">
    <h3 class="fw-bold mb-4 text-dark">Quản lý danh mục</h3>

    <div v-if="errorMessage" class="alert alert-danger shadow-sm rounded-3 border-0 mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ errorMessage }}
      <button type="button" class="btn-close float-end" @click="errorMessage = ''"></button>
    </div>

    <div v-if="successMessage" class="alert alert-success shadow-sm rounded-3 border-0 mb-4">
      <i class="bi bi-check-circle-fill me-2"></i>
      {{ successMessage }}
      <button type="button" class="btn-close float-end" @click="successMessage = ''"></button>
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 sticky-top" style="top: 20px; z-index: 1;">
          <div class="card-header bg-white py-3 border-0">
            <h6 class="fw-bold mb-0 text-primary">
              <i :class="form.id ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
              <span>{{ form.id ? 'Cập nhật danh mục' : 'Thêm mới danh mục' }}</span>
            </h6>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Tên danh mục</label>
                <input type="text" v-model="form.name" class="form-control bg-light border-0 py-2" placeholder="Ví dụ: Đồng hồ Nam" required>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary rounded-pill fw-bold shadow-sm" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-save me-2"></i>{{ isSubmitting ? 'Đang lưu...' : 'Lưu lại' }}
                </button>
                <button type="button" v-if="form.id" @click="resetForm" class="btn btn-light rounded-pill text-muted">
                  <i class="bi bi-x-circle me-1"></i>Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center py-5 text-muted">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <table v-else class="table table-hover align-middle mb-0">
              <thead class="bg-light text-secondary">
                <tr>
                  <th class="ps-4 border-0">ID</th>
                  <th class="border-0">Tên danh mục</th>
                  <th class="border-0 text-center">Số sản phẩm</th>
                  <th class="text-end pe-4 border-0">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in categories" :key="cat.id!">
                  <td class="ps-4 fw-bold text-muted">#{{ cat.id }}</td>
                  <td class="fw-bold text-dark">{{ cat.name }}</td>
                  
                  <td class="text-center">
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                        <span>{{ cat.productCount || 0 }}</span> SP
                    </span>
                  </td>

                  <td class="text-end pe-4">
                    <button @click="editCategory(cat)" class="btn btn-sm btn-light text-warning shadow-sm me-1" title="Sửa">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button @click="cat.id && handleDelete(cat.id)" class="btn btn-sm btn-light text-danger shadow-sm" title="Xóa">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="categories.length === 0">
                  <td colspan="4" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Chưa có danh mục nào.
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
  if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    errorMessage.value = '';
    successMessage.value = '';
    try {
      await api.delete(`/admin/categories/${id}`);
      successMessage.value = "Đã xóa danh mục thành công.";
      await fetchCategories();
    } catch (err: any) {
      // [LOGIC ĐÃ THÊM]: Bắt đúng lỗi không cho xóa nếu có sản phẩm bên trong
      errorMessage.value = err.response?.data?.message || "Không thể xóa danh mục này vì đang có sản phẩm bên trong!";
    }
  }
};
</script>

<style scoped>
/* Không cần CSS thêm, style của Bootstrap mày viết quá tốt rồi */
</style>