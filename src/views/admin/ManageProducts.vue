<template>
  <div class="admin-products-page p-4 p-md-5">
    
    <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
      <div class="d-flex align-items-center">
        <div class="title-accent me-3"></div>
        <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Quản lý tuyệt tác</h3>
      </div>
      
      <div class="d-flex gap-3 align-items-center">
        <div class="position-relative shadow-sm" style="width: 280px;">
          <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          <input type="text" v-model="searchQuery" class="form-control custom-input ps-5 m-0" placeholder="Tìm tên, mã Ref, thương hiệu...">
        </div>

        <button class="btn btn-gold fw-bold shadow-sm rounded-1 px-4 py-2 text-uppercase letter-spacing-1" @click="openAddModal">
          <i class="bi bi-plus-lg me-2"></i>Thêm Mới
        </button>
      </div>
    </div>

    <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
      
      <div v-if="isLoading" class="text-center py-5 my-5">
        <div class="spinner-border gold-text" role="status"></div>
        <p class="mt-3 fw-bold text-muted text-uppercase letter-spacing-1 small">Đang tải dữ liệu kho...</p>
      </div>

      <div class="table-responsive" v-else>
        <table class="table luxury-table align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 text-uppercase letter-spacing-1">Sản phẩm</th>
              <th class="text-uppercase letter-spacing-1">Thông số</th>
              <th class="text-uppercase letter-spacing-1">Giá bán</th>
              <th class="text-uppercase letter-spacing-1">Tồn kho</th>
              <th class="text-end pe-4 text-uppercase letter-spacing-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredProducts" :key="p.id" class="table-row-hover">
              
              <td class="ps-4 py-3">
                <div class="d-flex align-items-center">
                  <div class="img-wrap border-gold-subtle p-1 bg-light me-3">
                    <img :src="getImageUrl(p.imageUrl)" class="img-fluid" alt="img" @error="handleImageError">
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1 text-dark luxury-font fs-5">{{ p.name }}</h6>
                    <small class="text-muted text-uppercase letter-spacing-1" style="font-size: 11px;">Ref: <strong class="text-dark">{{ p.code || '---' }}</strong></small>
                  </div>
                </div>
              </td>
              
              <td class="py-3">
                <div class="d-flex flex-column small">
                  <span class="badge-category mb-2 align-self-start">{{ p.categoryName || 'Chưa phân loại' }}</span>
                  <span class="text-muted text-uppercase letter-spacing-1" style="font-size: 11px;">Thương hiệu: <strong class="text-dark">{{ p.brand }}</strong></span>
                </div>
              </td>
              
              <td class="py-3">
                <div v-if="isSaleActive(p)">
                  <div class="text-danger fw-bold fs-5 luxury-font">{{ formatPrice(calculateSalePrice(p.price, p.discount)) }}</div>
                  <div class="d-flex align-items-center mt-1">
                    <small class="text-muted text-decoration-line-through me-2">{{ formatPrice(p.price) }}</small>
                    <span class="badge-sale">-{{ p.discount }}%</span>
                  </div>
                </div>
                <div v-else class="fw-bold text-dark fs-5 luxury-font">
                  {{ formatPrice(p.price) }}
                </div>
              </td>
              
              <td class="py-3">
                <span v-if="p.stock > 0" class="status-badge status-success">
                  <i class="bi bi-check2-circle me-1"></i> Sẵn sàng ({{ p.stock }})
                </span>
                <span v-else class="status-badge status-danger">
                  <i class="bi bi-x-circle me-1"></i> Hết hàng
                </span>
              </td>
              
              <td class="text-end pe-4 py-3">
                <div class="btn-group shadow-sm">
                  <button class="btn btn-sm btn-light border-gold-subtle text-dark action-btn" @click="openSaleModal(p)" title="Khuyến mãi">
                    <i class="bi bi-percent gold-text"></i>
                  </button>
                  <button class="btn btn-sm btn-light border-gold-subtle text-dark action-btn" @click="openImportModal(p)" title="Nhập kho">
                    <i class="bi bi-box-seam"></i>
                  </button>
                  <button class="btn btn-sm btn-light border-gold-subtle text-dark action-btn" @click="openEditModal(p)" title="Chỉnh sửa">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-light border-gold-subtle text-danger action-btn hover-danger" @click="deleteProduct(p.id)" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
              
            </tr>
            
            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="text-center py-5 text-muted fst-italic">
                <span v-if="products.length === 0">Hệ thống chưa có sản phẩm nào.</span>
                <span v-else>Không tìm thấy sản phẩm nào phù hợp với "{{ searchQuery }}".</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade luxury-modal" id="productModal" tabindex="-1" aria-hidden="true" ref="productModalRef">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 rounded-1 shadow-lg">
          
          <div class="modal-header border-bottom border-gold-subtle bg-light px-4 py-3">
            <h5 class="modal-title luxury-font fw-bold text-uppercase letter-spacing-1 text-dark">{{ isEditing ? 'Cập nhật tuyệt tác' : 'Thêm mới tuyệt tác' }}</h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          
          <div class="modal-body p-4 p-md-5">
            <form @submit.prevent="saveProduct">
              <div class="row g-5">
                
                <div class="col-lg-6 border-end-lg border-gold-subtle pe-lg-5">
                  <h6 class="gold-text fw-bold mb-4 text-uppercase letter-spacing-1 border-bottom pb-2"><i class="bi bi-info-circle me-2"></i>Thông tin tổng quan</h6>
                  <div class="row g-4">
                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Tên sản phẩm</label>
                      <input type="text" v-model="form.name" class="form-control custom-input" placeholder="Nhập tên..." required>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Danh mục</label>
                      <select v-model="form.categoryId" class="form-select custom-input">
                        <option value="">-- Phân loại --</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Giá niêm yết (VNĐ)</label>
                      <input type="number" v-model="form.price" class="form-control custom-input fw-bold text-danger" placeholder="0" required>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Hình ảnh đại diện</label>
                      <input type="file" ref="fileInput" class="form-control custom-input mb-3" accept="image/*" @change="previewImage">
                      
                      <div class="text-center border-gold-subtle rounded-1 bg-light p-3 position-relative d-flex justify-content-center align-items-center" style="min-height: 150px; border: 1px dashed #dcdcdc;">
                        <template v-if="previewImgUrl">
                          <img :src="previewImgUrl" style="max-height: 140px; mix-blend-mode: multiply;" class="img-fluid">
                          <button type="button" @click="removeMainImage" class="btn btn-danger btn-sm rounded-0 position-absolute top-0 end-0 m-2 shadow-sm"><i class="bi bi-x-lg"></i></button>
                        </template>
                        <p v-else class="text-muted small fst-italic mb-0"><i class="bi bi-image me-1"></i> Chưa có ảnh đại diện</p>
                      </div>
                    </div>

                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mt-2">Thư viện ảnh (Nhiều ảnh)</label>
                      <input type="file" class="form-control custom-input mb-3" multiple accept="image/*" @change="handleAlbumChange">
                      
                      <div class="d-flex flex-wrap gap-3 p-3 border-gold-subtle rounded-1 bg-light" style="border: 1px dashed #dcdcdc;" v-if="albumPreviews.length > 0">
                        <div v-for="(url, index) in albumPreviews" :key="index" class="position-relative border p-1 bg-white">
                          <img :src="url" style="width: 70px; height: 70px; object-fit: contain; mix-blend-mode: multiply;">
                          <button type="button" @click="removeAlbumImage(index)" class="btn btn-danger btn-sm rounded-0 position-absolute top-0 start-100 translate-middle shadow-sm py-0 px-1" style="font-size: 10px;"><i class="bi bi-x-lg"></i></button>
                        </div>
                      </div>
                      <div v-else class="text-center p-3 border-gold-subtle rounded-1 bg-light" style="border: 1px dashed #dcdcdc;">
                        <span class="text-muted small fst-italic"><i class="bi bi-images me-1"></i> Chưa có ảnh chi tiết.</span>
                      </div>
                    </div>

                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Câu chuyện thiết kế</label>
                      <textarea v-model="form.description" class="form-control custom-input" rows="4" placeholder="Mô tả sự tinh xảo..."></textarea>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="bg-light border-gold-subtle rounded-1 p-4 p-md-5 h-100">
                    <h6 class="text-dark fw-bold mb-4 text-uppercase letter-spacing-1 border-bottom pb-2"><i class="bi bi-gear-wide-connected gold-text me-2"></i>Thông số kỹ thuật</h6>
                    <div class="row g-4">
                      <div class="col-md-12">
                        <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Thương hiệu</label>
                        <input type="text" v-model="form.brand" class="form-control custom-input" placeholder="VD: Rolex, Patek Philippe...">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Mã định danh (Ref)</label>
                        <input type="text" v-model="form.code" class="form-control custom-input" placeholder="VD: 116610LN">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Động cơ (Máy)</label>
                        <input type="text" v-model="form.machineType" class="form-control custom-input" placeholder="VD: Automatic Calibre 3135">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Chất liệu kính</label>
                        <input type="text" v-model="form.glassMaterial" class="form-control custom-input" placeholder="VD: Sapphire nguyên khối">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Đường kính mặt</label>
                        <input type="text" v-model="form.diameter" class="form-control custom-input" placeholder="VD: 40mm">
                      </div>
                      <div class="col-md-12">
                        <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Khả năng kháng nước</label>
                        <input type="text" v-model="form.waterResistance" class="form-control custom-input" placeholder="VD: 300m / 1000ft">
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

              <div class="mt-5 pt-4 border-top border-gold-subtle d-flex justify-content-end">
                <button type="button" class="btn btn-outline-secondary rounded-1 px-4 py-2 me-3 fw-bold text-uppercase letter-spacing-1" data-bs-dismiss="modal">Hủy bỏ</button>
                <button type="submit" class="btn btn-gold rounded-1 fw-bold py-2 px-5 text-uppercase letter-spacing-1 shadow-sm" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check2-circle me-2"></i> Lưu hồ sơ sản phẩm
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>

    <div class="modal fade luxury-modal" id="importModal" tabindex="-1" aria-hidden="true" ref="importModalRef">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <div class="modal-content border-0 rounded-1 shadow-lg">
          <div class="modal-header border-bottom border-gold-subtle bg-light">
            <h6 class="modal-title fw-bold text-dark text-uppercase letter-spacing-1"><i class="bi bi-box-seam gold-text me-2"></i>Nhập kho</h6>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4 p-md-5">
            <form @submit.prevent="submitImport">
              <div class="mb-4 text-center border-bottom border-dashed pb-3">
                <p class="small text-muted text-uppercase letter-spacing-1 mb-1">Mã sản phẩm:</p>
                <h6 class="fw-bold luxury-font text-dark fs-5">{{ currentImportProduct.name }}</h6>
              </div>
              <div class="mb-4">
                <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1 text-center d-block">Số lượng bổ sung</label>
                <input type="number" v-model="importQuantity" class="form-control form-control-lg text-center fw-bold custom-input" min="1" required style="font-size: 24px;">
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-dark rounded-1 fw-bold py-3 text-uppercase letter-spacing-1" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span> Xác nhận nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade luxury-modal" id="saleModal" tabindex="-1" aria-hidden="true" ref="saleModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-1 shadow-lg">
          <div class="modal-header border-bottom border-gold-subtle bg-light">
            <h6 class="modal-title fw-bold text-dark text-uppercase letter-spacing-1"><i class="bi bi-percent text-danger me-2"></i>Thiết lập đặc quyền</h6>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4 p-md-5">
            <form @submit.prevent="submitSale">
              <div class="mb-4 text-center border-bottom border-dashed pb-3">
                <p class="small text-muted text-uppercase letter-spacing-1 mb-1">Sản phẩm áp dụng:</p>
                <h6 class="fw-bold luxury-font text-dark fs-5">{{ currentSaleProduct.name }}</h6>
              </div>
              
              <div class="mb-4">
                <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Tỷ lệ chiết khấu (%)</label>
                <input type="number" v-model="saleForm.discount" class="form-control custom-input fw-bold text-danger fs-5" min="0" max="100" required>
              </div>
              
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Kích hoạt từ</label>
                  <input type="datetime-local" step="1" v-model="saleForm.discountStart" class="form-control custom-input" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Kết thúc vào</label>
                  <input type="datetime-local" step="1" v-model="saleForm.discountEnd" class="form-control custom-input" required>
                </div>
              </div>
              
              <div class="p-3 bg-light border-gold-subtle rounded-1 mb-4 text-center">
                <div class="text-muted small text-uppercase letter-spacing-1 mb-1">Giá niêm yết: <span class="text-decoration-line-through">{{ formatPrice(currentSaleProduct.price) }}</span></div>
                <div class="fw-bold text-dark text-uppercase letter-spacing-1">Giá đặc quyền: <strong class="text-danger fs-4 luxury-font d-block mt-1">{{ formatPrice(calculateSalePrice(currentSaleProduct.price, saleForm.discount)) }}</strong></div>
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-gold rounded-1 fw-bold py-3 text-uppercase letter-spacing-1" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span> Ban hành chính sách
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
import { ref, onMounted, computed } from 'vue'; 
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

const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);

// BIẾN CHO CHỨC NĂNG TÌM KIẾM
const searchQuery = ref('');

// LOGIC TÌM KIẾM
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(p => 
    (p.name && p.name.toLowerCase().includes(query)) || 
    (p.code && p.code.toLowerCase().includes(query)) ||
    (p.brand && p.brand.toLowerCase().includes(query))
  );
});

const productModalRef = ref(null);
const importModalRef = ref(null);
const saleModalRef = ref(null);

let productModalInstance: any = null;
let importModalInstance: any = null;
let saleModalInstance: any = null;

const isEditing = ref(false);
const previewImgUrl = ref('');
const fileInput = ref<any>(null);
const albumPreviews = ref<string[]>([]);

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
  imageFile: null as File | null,
  albumFiles: [] as File[]
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
  }
};

const resetForm = () => {
  form.value = {
    id: '', name: '', price: '', brand: '', categoryId: '', description: '',
    code: '', machineType: '', glassMaterial: '', diameter: '', waterResistance: '', 
    imageFile: null, albumFiles: []
  };
  previewImgUrl.value = '';
  albumPreviews.value = []; 
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
    id: p.id, name: p.name, price: p.price, brand: p.brand || '', categoryId: p.categoryId || '',
    description: p.description || '', code: p.code || '', machineType: p.machineType || '',
    glassMaterial: p.glassMaterial || '', diameter: p.diameter || '', waterResistance: p.waterResistance || '',
    imageFile: null, albumFiles: []
  };

  previewImgUrl.value = getImageUrl(p.imageUrl);
  albumPreviews.value = []; 
  if (p.imageUrls && p.imageUrls.length > 0) {
    if (Array.isArray(p.imageUrls)) {
      albumPreviews.value = p.imageUrls.map((img: string) => getImageUrl(img));
    } else if (typeof p.imageUrls === 'string') {
      albumPreviews.value = p.imageUrls.split(',').map((img: string) => getImageUrl(img));
    }
  }
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
    
    if (form.value.categoryId) formData.append('category.id', form.value.categoryId);
    if (form.value.imageFile) formData.append('imageFile', form.value.imageFile);

    if (form.value.albumFiles.length > 0) {
      form.value.albumFiles.forEach(file => {
        formData.append('albumFiles', file); 
      });
    }

    await api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    productModalInstance?.hide();
    fetchData(); 
  } catch (error) {
    // SỬA ĐỔI 1: Thay thế alert()
    LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi khi lưu sản phẩm!' });
  } finally {
    isSaving.value = false;
  }
};
const removeMainImage = () => {
  form.value.imageFile = null;
  previewImgUrl.value = '';
  if (fileInput.value) fileInput.value.value = ''; 
};
const handleAlbumChange = (e: any) => {
  const files = Array.from(e.target.files) as File[];
  files.forEach(f => {
    form.value.albumFiles.push(f);
    albumPreviews.value.push(URL.createObjectURL(f));
  });
};
const removeAlbumImage = (index: number) => {
  form.value.albumFiles.splice(index, 1);
  albumPreviews.value.splice(index, 1);
};

const deleteProduct = async (id: number) => {
  // SỬA ĐỔI 2: Thay thế confirm()
  const result = await LuxuryAlert.fire({
    icon: 'warning',
    title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Cảnh báo</h4>',
    text: 'Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống. Xác nhận xóa?',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận xóa',
    cancelButtonText: 'Hủy bỏ'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/admin/products/${id}`);
      fetchData();
    } catch (error) {
      // SỬA ĐỔI 3: Thay thế alert()
      LuxuryAlert.fire({ icon: 'error', title: 'Không thể xóa', text: 'Không thể xóa tuyệt tác này (đã phát sinh giao dịch).' });
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
    // SỬA ĐỔI 4: Thay thế alert()
    LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi khi nhập kho!' });
  } finally {
    isSaving.value = false;
  }
};

const calculateSalePrice = (price: any, discount: any) => {
  return price * (1 - (discount || 0) / 100);
};

const isSaleActive = (p: any) => {
  if (!p.discount || p.discount <= 0 || !p.discountStart || !p.discountEnd) return false;
  const parseJavaDate = (str: string) => {
    if (!str) return new Date(0);
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

    formData.append('discount', saleForm.value.discount ? saleForm.value.discount.toString() : '0');
    
    const formatJavaDate = (inputDate: string) => {
      if (!inputDate) return ''; 
      const [datePart, timePart] = inputDate.split('T');
      if (!datePart || !timePart) return '';
      const [y, m, d] = datePart.split('-');
      let finalTime = timePart;
      if (finalTime.split(':').length === 2) finalTime += ':00'; 
      return `${d}/${m}/${y} ${finalTime}`;
    };

    const dStart = formatJavaDate(saleForm.value.discountStart);
    if (dStart) formData.append('discountStart', dStart);
    const dEnd = formatJavaDate(saleForm.value.discountEnd);
    if (dEnd) formData.append('discountEnd', dEnd);

    await api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    saleModalInstance?.hide();
    fetchData();
  } catch (error) {
    console.error("Lỗi khi lưu khuyến mãi:", error);
    // SỬA ĐỔI 5: Thay thế alert()
    LuxuryAlert.fire({ icon: 'error', title: 'Lỗi cấu trúc', text: 'Lỗi cấu trúc thời gian! Vui lòng kiểm tra lại định dạng.' });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN PRODUCTS
========================================== */
.admin-products-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.border-dashed { border-bottom: 1px dashed #dcdcdc !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }

/* Bảng Dữ liệu (Table) */
.luxury-table { margin-bottom: 0; }
.luxury-table thead { background-color: #fafafa; }
.luxury-table th { 
  font-size: 11px; color: #888; font-weight: 700; 
  padding: 15px 10px; border-bottom: 1px solid #eaeaea;
}
.luxury-table td { padding: 15px 10px; color: #444; border-bottom: 1px solid #f9f9f9; vertical-align: middle; }
.table-row-hover { transition: all 0.2s ease; background-color: #fff; }
.table-row-hover:hover { background-color: #fdfbf7; }

/* Các thành phần trong bảng */
.img-wrap { width: 60px; height: 60px; border-radius: 2px; }
.img-wrap img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }

.badge-category { 
  display: inline-block; background: #fdfbf7; color: #B38728; 
  border: 1px solid #e8dcc4; font-size: 10px; 
  text-transform: uppercase; letter-spacing: 1px; 
  padding: 4px 8px; border-radius: 2px; font-weight: bold;
}
.badge-sale { 
  background: #8b0000; color: #fff; padding: 2px 6px; 
  font-size: 11px; font-weight: bold; border-radius: 2px;
}

.status-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.status-success { color: #1a661a; }
.status-danger { color: #cc0000; }

/* Cột Hành động (Action Buttons) */
.action-btn { border-radius: 0; padding: 4px 10px; background: #fff; transition: 0.3s; }
.action-btn:hover { background: #fdfbf7; border-color: #D4AF37; color: #D4AF37 !important; }
.hover-danger:hover { background: #fff5f5; border-color: #8b0000; color: #8b0000 !important; }

/* ==========================================
   MODAL & FORMS
========================================== */
.custom-input { 
  border: 1px solid #e0e0e0; border-radius: 2px; 
  padding: 10px 15px; font-size: 14px; background: #fafafa; 
  transition: all 0.3s; box-shadow: none;
}
.custom-input:focus { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); outline: none; }

/* Nút Submit */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37;
  transition: all 0.4s ease;
}
.btn-gold:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}
</style>