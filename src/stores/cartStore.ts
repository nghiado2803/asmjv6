import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Lấy dữ liệu cũ từ LocalStorage (nếu có)
  const items = ref<any[]>(JSON.parse(localStorage.getItem('watch_cart') || '[]'));

  // Tự động lưu lại mỗi khi giỏ hàng thay đổi
  watch(items, (newItems) => {
    localStorage.setItem('watch_cart', JSON.stringify(newItems));
  }, { deep: true });

  // Tính tổng tiền
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  // Thêm vào giỏ
  const addToCart = (product: any, quantity: number = 1) => {
    const existing = items.value.find(i => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    }
  };

  // Tăng giảm số lượng
  const updateQuantity = (productId: number, change: number) => {
    const item = items.value.find(i => i.productId === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity < 1) item.quantity = 1; // Không cho tụt xuống 0
    }
  };

  // Xóa sản phẩm
  const removeItem = (productId: number) => {
    items.value = items.value.filter(i => i.productId !== productId);
  };

  // Xóa sạch giỏ hàng (Dùng khi thanh toán xong)
  const clearCart = () => {
    items.value = [];
  };

  return { items, totalPrice, addToCart, updateQuantity, removeItem, clearCart };
});