<template>
  <div class="container-custom py-5">
    <div class="mb-4">
      <h2 class="fw-bold text-dark mb-0">SẢN PHẨM MỚI</h2>
      <p class="text-muted small">Cập nhật những mẫu đồng hồ thời thượng nhất</p>
    </div>

    <div class="filter-bar">
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <span class="fw-bold text-muted small text-uppercase"><i class="bi bi-filter"></i> Lọc:</span>
        
        <select v-model="filters.categoryId" class="custom-select" @change="applyFilters">
          <option value="">Thương hiệu</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        
        <select v-model="filters.priceRange" class="custom-select" @change="applyFilters">
          <option value="">Mức giá</option>
          <option value="under100">Dưới 100 triệu</option>
          <option value="100to300">100 - 300 triệu</option>
          <option value="over300">Trên 300 triệu</option>
        </select>
        
        <select v-model="filters.sort" class="custom-select" @change="applyFilters">
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
      </div>
      
      <div class="search-wrapper">
        <i class="bi bi-search search-icon"></i>
        <input type="text" v-model="filters.keyword" class="search-input" placeholder="Tìm kiếm sản phẩm..." @keyup.enter="applyFilters">
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted fw-bold">Đang tải danh sách sản phẩm...</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
      
      <div v-if="products.length === 0" class="col-12 text-center py-5">
        <p class="text-muted">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
        <button @click="resetFilters" class="btn btn-dark btn-sm rounded-pill px-4">Xóa bộ lọc</button>
      </div>

      <div class="col" v-for="p in products" :key="p.id">
        <div class="product-card">
          <span class="badge-hot" v-if="isSaleActive(p)">-{{ p.discount }}%</span>
          <span class="badge-hot" v-else>HOT</span>
          
          <div class="img-wrap">
            <router-link :to="`/product/${p.id}`">
              <img :src="`http://localhost:8080/images/${p.imageUrl}`" class="product-img" :alt="p.name" @error="handleImageError">
            </router-link>
          </div>
          
          <div class="card-info">
            <span class="brand-name">{{ p.brand || 'Luxury' }}</span>
            <router-link :to="`/product/${p.id}`" class="product-name">{{ p.name }}</router-link>
            
            <div v-if="isSaleActive(p)">
              <div class="price-text text-danger">{{ formatPrice(calculateSalePrice(p.price, p.discount)) }}</div>
              <div class="text-muted text-decoration-line-through small">{{ formatPrice(p.price) }}</div>
            </div>
            <div v-else class="price-text">{{ formatPrice(p.price) }}</div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import api from '@/api/index';

// Định nghĩa Interface
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount?: number;
  discountStart?: string; // Đã thêm
  discountEnd?: string;   // Đã thêm
  imageUrl: string;
}

// State
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const isLoading = ref(true);

const filters = reactive({ 
  categoryId: '', 
  priceRange: '', 
  sort: 'newest', 
  keyword: '' 
});

// Hàm gọi API thực tế
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/products', { params: filters });
    // Dữ liệu trả về dạng Map có "products" và "categories"
    products.value = res.data.products;
    categories.value = res.data.categories;
  } catch (error) {
    console.error("Lỗi khi tải danh sách sản phẩm:", error);
  } finally {
    isLoading.value = false;
  }
};

// Gọi khi lần đầu vào trang
onMounted(() => {
  fetchProducts();
});

// Gọi khi có thay đổi bộ lọc
const applyFilters = () => {
  fetchProducts();
};

const resetFilters = () => {
  filters.categoryId = ''; 
  filters.priceRange = ''; 
  filters.sort = 'newest'; 
  filters.keyword = '';
  applyFilters();
};

// Utils
const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/200';
};

// ==========================================
// CÁC HÀM XỬ LÝ KHUYẾN MÃI (ĐƯỢC THÊM MỚI)
// ==========================================
const calculateSalePrice = (price: number, discount?: number) => {
  return price * (1 - (discount || 0) / 100);
};

const isSaleActive = (p: Product) => {
  if (!p.discount || p.discount <= 0 || !p.discountStart || !p.discountEnd) return false;
  
 const parseJavaDate = (str: string) => {
    if (!str) return new Date(0);
    
    // Tách thẳng thành 2 biến chuỗi để TypeScript không bắt bẻ
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
</script>

<style scoped>
/* Toàn bộ CSS của mày quá chuẩn rồi, tao giữ nguyên 100% */
.container-custom { max-width: 1300px; margin: 0 auto; padding: 0 15px; }
.filter-bar { background: #fff; padding: 15px 20px; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; }
.custom-select { border: 1px solid #eee; border-radius: 6px; padding: 8px 12px; font-size: 14px; color: #555; background-color: #fff; cursor: pointer; transition: 0.2s; }
.custom-select:hover { border-color: #0d6efd; }
.search-input { border: 1px solid #eee; border-radius: 20px; padding: 8px 15px 8px 40px; font-size: 14px; width: 100%; background: #f9f9f9; outline: none; }
.search-wrapper { position: relative; width: 300px; }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }
.product-card { background: #fff; border-radius: 16px; overflow: hidden; border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: all 0.3s ease; position: relative; height: 100%; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
.badge-hot { position: absolute; top: 15px; left: 15px; background-color: #dc3545; color: #fff; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; z-index: 10; text-transform: uppercase; box-shadow: 0 3px 6px rgba(220, 53, 69, 0.3); }
.img-wrap { height: 260px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden; }
.product-img { max-height: 100%; max-width: 100%; transition: transform 0.5s ease; mix-blend-mode: multiply; }
.product-card:hover .product-img { transform: scale(1.1); }
.card-info { padding: 20px 15px; text-align: center; }
.brand-name { color: #888; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; display: block; }
.product-name { display: block; color: #222; font-size: 16px; font-weight: 700; text-decoration: none; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-name:hover { color: #0d6efd; }
.price-text { color: #0d6efd; font-size: 18px; font-weight: 700; }
</style>