import { defineStore } from 'pinia';
import api from '@/api/index'; 

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as any[],
    bestSellers: [] as any[],
    isLoading: false
  }),

  actions: {
    async fetchAllData() {
      if (this.products.length > 0) return;

      this.isLoading = true;
      try {
        const [prodRes, bestRes] = await Promise.all([
          api.get('/products'),
          api.get('/products/best-sellers')
        ]);
        
        this.products = prodRes.data.products; 
        this.bestSellers = bestRes.data;
      } finally {
        this.isLoading = false;
      }
    }
  }
});