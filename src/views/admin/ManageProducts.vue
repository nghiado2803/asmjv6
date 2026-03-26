<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark">Quản lý sản phẩm</h3>
      <button class="btn btn-primary fw-bold shadow-sm rounded-pill px-4" @click="openAddModal">
        <i class="bi bi-plus-lg me-2"></i>Thêm Mới
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
      </div>

      <div class="table-responsive" v-else>
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light text-secondary">
            <tr>
              <th class="ps-4">Sản phẩm</th>
              <th>Thông chi chi tiết</th>
              <th>Giá bán</th>
              <th>Kho hàng</th>
              <th class="text-end pe-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <img :src="getImageUrl(p.imageUrl)" class="rounded-3 border bg-white" style="width: 50px; height: 50px; object-fit: contain;" alt="img" @error="handleImageError">
                  <div class="ms-3">
                    <h6 class="fw-bold mb-0 text-dark">{{ p.name }}</h6>
                    <small class="text-muted">Mã: {{ p.code || '---' }}</small>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column small">
                  <span class="badge bg-primary bg-opacity-10 text-primary mb-1 align-self-start">{{ p.categoryName || 'Chưa phân loại' }}</span>
                  <span class="text-muted fw-bold">Hãng: {{ p.brand }}</span>
                </div>
              </td>
              <td>
                <div v-if="isSaleActive(p)">
                  <div class="text-danger fw-bold">{{ formatPrice(calculateSalePrice(p.price, p.discount)) }}</div>
                  <small class="text-muted text-decoration-line-through">{{ formatPrice(p.price) }}</small>
                  <span class="badge bg-danger ms-1" style="font-size: 0.7rem;">-{{ p.discount }}%</span>
                </div>
                <div v-else class="fw-bold text-dark">
                  {{ formatPrice(p.price) }}
                </div>
              </td>
              <td>
                <span v-if="p.stock > 0" class="text-success fw-bold small">
                  <i class="bi bi-check-circle-fill me-1"></i>Sẵn hàng (<span>{{ p.stock }}</span>)
                </span>
                <span v-else class="text-danger fw-bold small">
                  <i class="bi bi-x-circle-fill me-1"></i>Hết hàng
                </span>
              </td>
              <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-warning me-1" @click="openSaleModal(p)" title="Thiết lập giảm giá">
                  <i class="bi bi-percent"></i>
                </button>

                <button class="btn btn-sm btn-outline-success me-1" @click="openImportModal(p)" title="Nhập thêm hàng">
                  <i class="bi bi-box-seam-fill"></i>
                </button>
                <button class="btn btn-sm btn-light text-primary me-1" @click="openEditModal(p)" title="Chỉnh sửa">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-light text-danger" @click="deleteProduct(p.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">Chưa có sản phẩm nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true" ref="productModalRef">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">{{ isEditing ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveProduct">
              <div class="row g-4">
                <div class="col-lg-6 border-end">
                  <h6 class="text-primary fw-bold mb-3"><i class="bi bi-info-circle me-2"></i>Thông tin chung</h6>
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted">Tên sản phẩm</label>
                      <input type="text" v-model="form.name" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Danh mục</label>
                      <select v-model="form.categoryId" class="form-select">
                        <option value="">-- Chọn danh mục --</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Giá bán (VNĐ)</label>
                      <input type="number" v-model="form.price" class="form-control" required>
                    </div>
                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted">Hình ảnh</label>
                      <input type="file" ref="fileInput" class="form-control" accept="image/*" @change="previewImage">
                      <div class="mt-2 text-center border rounded-3 bg-white p-2 position-relative" style="min-height: 120px;">
                        <img v-if="previewImgUrl" :src="previewImgUrl" style="max-height: 150px;" class="rounded">
                        <p v-else class="text-muted small position-absolute top-50 start-50 translate-middle">Chưa chọn ảnh</p>
                      </div>
                    </div>
                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted">Mô tả ngắn</label>
                      <textarea v-model="form.description" class="form-control" rows="3"></textarea>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6 bg-light bg-opacity-50 rounded-3 p-3">
                  <h6 class="text-success fw-bold mb-3"><i class="bi bi-gear-wide-connected me-2"></i>Thông số kỹ thuật</h6>
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label small fw-bold text-muted">Thương hiệu</label>
                      <input type="text" v-model="form.brand" class="form-control" placeholder="VD: Rolex">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Mã sản phẩm</label>
                      <input type="text" v-model="form.code" class="form-control" placeholder="VD: WS-001">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Loại máy</label>
                      <input type="text" v-model="form.machineType" class="form-control" placeholder="VD: Automatic">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Chất liệu kính</label>
                      <input type="text" v-model="form.glassMaterial" class="form-control" placeholder="VD: Sapphire">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Đường kính</label>
                      <input type="text" v-model="form.diameter" class="form-control" placeholder="VD: 41mm">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted">Độ chịu nước</label>
                      <input type="text" v-model="form.waterResistance" class="form-control" placeholder="VD: 30 ATM">
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary rounded-pill fw-bold py-2 shadow-sm" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check2-circle me-2"></i> Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="importModal" tabindex="-1" aria-hidden="true" ref="importModalRef">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-0 bg-success bg-opacity-10">
            <h6 class="modal-title fw-bold text-success"><i class="bi bi-box-seam me-2"></i>Nhập kho</h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitImport">
              <div class="mb-3 text-center">
                <p class="small text-muted mb-1">Sản phẩm:</p>
                <h6 class="fw-bold">{{ currentImportProduct.name }}</h6>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Số lượng nhập thêm</label>
                <input type="number" v-model="importQuantity" class="form-control form-control-lg text-center fw-bold text-success" min="1" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-success rounded-pill fw-bold" :disabled="isSaving">Xác nhận nhập</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="saleModal" tabindex="-1" aria-hidden="true" ref="saleModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-0 bg-warning bg-opacity-10">
            <h6 class="modal-title fw-bold text-dark"><i class="bi bi-percent me-2"></i>Thiết lập khuyến mãi</h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitSale">
              <div class="mb-3 text-center">
                <p class="small text-muted mb-1">Sản phẩm:</p>
                <h6 class="fw-bold">{{ currentSaleProduct.name }}</h6>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Phần trăm giảm giá (%)</label>
                <input type="number" v-model="saleForm.discount" class="form-control" min="0" max="100" required>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Thời gian bắt đầu</label>
                <input type="datetime-local" step="1" v-model="saleForm.discountStart" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Thời gian kết thúc</label>
                <input type="datetime-local" step="1" v-model="saleForm.discountEnd" class="form-control" required>
              </div>
              <div class="alert alert-light border small">
                Giá gốc: {{ formatPrice(currentSaleProduct.price) }} <br>
                Giá sau giảm: <strong class="text-danger">{{ formatPrice(calculateSalePrice(currentSaleProduct.price, saleForm.discount)) }}</strong>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-warning rounded-pill fw-bold" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>Lưu khuyến mãi
                </button>
              </div>
            </form>
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

const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);

const productModalRef = ref(null);
const importModalRef = ref(null);
const saleModalRef = ref(null);

let productModalInstance: any = null;
let importModalInstance: any = null;
let saleModalInstance: any = null;

const isEditing = ref(false);
const previewImgUrl = ref('');
const fileInput = ref<any>(null);

const form = ref({
  id: '',
  name: '',
  price: '',
  brand: '',
  categoryId: '',
  description: '',
  code: '',
  machineType: '',
  glassMaterial: '',
  diameter: '',
  waterResistance: '',
  imageFile: null as File | null
});

const currentImportProduct = ref({ id: '', name: '' });
const importQuantity = ref(1);

const currentSaleProduct = ref<any>({});
const saleForm = ref({
  discount: 0,
  discountStart: '',
  discountEnd: ''
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/categories')
    ]);
    products.value = prodRes.data;
    categories.value = catRes.data;
  } catch (error) {
    console.error("Lỗi fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
  if (productModalRef.value) productModalInstance = new Modal(productModalRef.value);
  if (importModalRef.value) importModalInstance = new Modal(importModalRef.value);
  if (saleModalRef.value) saleModalInstance = new Modal(saleModalRef.value);
});

const getImageUrl = (img: string) => {
  if (!img || img === 'null') return 'https://via.placeholder.com/50';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/50';
};

const formatPrice = (val: number) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const previewImage = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    form.value.imageFile = file;
    previewImgUrl.value = URL.createObjectURL(file);
  } else {
    form.value.imageFile = null;
    previewImgUrl.value = '';
  }
};

const resetForm = () => {
  form.value = {
    id: '', name: '', price: '', brand: '', categoryId: '', description: '',
    code: '', machineType: '', glassMaterial: '', diameter: '', waterResistance: '', imageFile: null
  };
  previewImgUrl.value = '';
  if (fileInput.value) fileInput.value.value = '';
};

const openAddModal = () => {
  isEditing.value = false;
  resetForm();
  productModalInstance?.show();
};

const openEditModal = (p: any) => {
  isEditing.value = true;
  form.value = {
    id: p.id,
    name: p.name,
    price: p.price,
    brand: p.brand || '',
    categoryId: p.categoryId || '',
    description: p.description || '',
    code: p.code || '',
    machineType: p.machineType || '',
    glassMaterial: p.glassMaterial || '',
    diameter: p.diameter || '',
    waterResistance: p.waterResistance || '',
    imageFile: null
  };
  previewImgUrl.value = getImageUrl(p.imageUrl);
  productModalInstance?.show();
};

const saveProduct = async () => {
  isSaving.value = true;
  try {
    const formData = new FormData();
    if (form.value.id) formData.append('id', form.value.id);
    formData.append('name', form.value.name);
    formData.append('price', form.value.price);
    formData.append('brand', form.value.brand);
    formData.append('description', form.value.description);
    formData.append('code', form.value.code);
    formData.append('machineType', form.value.machineType);
    formData.append('glassMaterial', form.value.glassMaterial);
    formData.append('diameter', form.value.diameter);
    formData.append('waterResistance', form.value.waterResistance);
    
    if (form.value.categoryId) {
        formData.append('category.id', form.value.categoryId);
    }

    if (form.value.imageFile) {
      formData.append('imageFile', form.value.imageFile);
    }

    await api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    productModalInstance?.hide();
    fetchData(); 
  } catch (error) {
    alert("Lỗi khi lưu sản phẩm!");
  } finally {
    isSaving.value = false;
  }
};

const deleteProduct = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    try {
      await api.delete(`/admin/products/${id}`);
      fetchData();
    } catch (error) {
      alert("Không thể xóa sản phẩm này (có thể đã nằm trong đơn hàng).");
    }
  }
};

const openImportModal = (p: any) => {
  currentImportProduct.value = { id: p.id, name: p.name };
  importQuantity.value = 1;
  importModalInstance?.show();
};

const submitImport = async () => {
  isSaving.value = true;
  try {
    await api.post('/admin/products/import-stock', {
      id: currentImportProduct.value.id,
      quantity: importQuantity.value
    });
    importModalInstance?.hide();
    fetchData();
  } catch (error) {
    alert("Lỗi khi nhập kho!");
  } finally {
    isSaving.value = false;
  }
};

// ==========================================
// CÁC HÀM XỬ LÝ KHUYẾN MÃI
// ==========================================

const calculateSalePrice = (price: any, discount: any) => {
  return price * (1 - (discount || 0) / 100);
};

const isSaleActive = (p: any) => {
  if (!p.discount || p.discount <= 0 || !p.discountStart || !p.discountEnd) return false;
  
  const parseJavaDate = (str: string) => {
    if (!str) return new Date(0);
    // Tách dùng Destructuring để TS an tâm
    const [datePart, timePart] = str.split(' ');
    if (!datePart || !timePart) return new Date(0);
    
    const [d, m, y] = datePart.split('/');
    return new Date(`${y}-${m}-${d}T${timePart}`);
  };

  const now = new Date();
  const start = parseJavaDate(p.discountStart);
  const end = parseJavaDate(p.discountEnd);
  return now >= start && now <= end;
};

const openSaleModal = (p: any) => {
  currentSaleProduct.value = p;
  
  const formatInputDate = (javaDate: string) => {
    if (!javaDate) return '';
    const [datePart, timePart] = javaDate.split(' ');
    if (!datePart || !timePart) return '';
    
    const [d, m, y] = datePart.split('/');
    return `${y}-${m}-${d}T${timePart}`;
  };

  saleForm.value = {
    discount: p.discount || 0,
    discountStart: formatInputDate(p.discountStart),
    discountEnd: formatInputDate(p.discountEnd)
  };
  saleModalInstance?.show();
};

const submitSale = async () => {
  isSaving.value = true;
  try {
    const formData = new FormData();
    const p = currentSaleProduct.value;
    
    // Gửi đầy đủ Data cũ để chống lỗi Null ở Java
    if (p.id != null) formData.append('id', p.id.toString());
    if (p.name) formData.append('name', p.name);
    if (p.price != null) formData.append('price', p.price.toString());
    
    if (p.brand && p.brand !== 'null') formData.append('brand', p.brand);
    if (p.description && p.description !== 'null') formData.append('description', p.description);
    if (p.code && p.code !== 'null') formData.append('code', p.code);
    if (p.machineType && p.machineType !== 'null') formData.append('machineType', p.machineType);
    if (p.glassMaterial && p.glassMaterial !== 'null') formData.append('glassMaterial', p.glassMaterial);
    if (p.diameter && p.diameter !== 'null') formData.append('diameter', p.diameter);
    if (p.waterResistance && p.waterResistance !== 'null') formData.append('waterResistance', p.waterResistance);
    if (p.categoryId && p.categoryId !== 'null') formData.append('category.id', p.categoryId.toString());

    // Gửi % Giảm giá
    formData.append('discount', saleForm.value.discount ? saleForm.value.discount.toString() : '0');
    
    // Format yyyy-MM-ddTHH:mm:ss sang dd/MM/yyyy HH:mm:ss
    const formatJavaDate = (inputDate: string) => {
      if (!inputDate) return ''; 
      
      const [datePart, timePart] = inputDate.split('T');
      if (!datePart || !timePart) return '';
      
      const [y, m, d] = datePart.split('-');
      let finalTime = timePart;
      
      if (finalTime.split(':').length === 2) {
        finalTime += ':00'; // Đảm bảo luôn có giây cho Java đọc
      }
      return `${d}/${m}/${y} ${finalTime}`;
    };

    const dStart = formatJavaDate(saleForm.value.discountStart);
    if (dStart) formData.append('discountStart', dStart);

    const dEnd = formatJavaDate(saleForm.value.discountEnd);
    if (dEnd) formData.append('discountEnd', dEnd);

    // Lưu vào Database
    await api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    saleModalInstance?.hide();
    fetchData();
    alert("Thiết lập khuyến mãi thành công!");
  } catch (error) {
    console.error("Lỗi khi lưu khuyến mãi:", error);
    alert("Lỗi 400: Dữ liệu gửi lên không khớp định dạng Java! Vui lòng kiểm tra lại Backend.");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* CSS giữ nguyên, không cần sửa đổi gì */
</style>