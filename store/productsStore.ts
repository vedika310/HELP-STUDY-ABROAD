import { create } from 'zustand';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface Category {
  slug: string;
  name: string;
  url: string;
}

interface ProductsState {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  categories: string[];
  cache: Map<string, { data: Product[]; total: number; timestamp: number }>;
  fetchProducts: (limit?: number, skip?: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  filterByCategory: (category: string, limit?: number, skip?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
  clearCache: () => void;
}

/**
 * Caching Strategy:
 * 
 * Similar to users store, we cache products data to:
 * 1. Minimize API calls for frequently accessed data
 * 2. Provide instant results for paginated views
 * 3. Cache search results and category filters separately
 * 4. Improve overall application performance
 * 
 * Cache keys:
 * - Products list: "products:limit:skip"
 * - Search: "products:search:query"
 * - Category filter: "products:category:categoryName:limit:skip"
 * - Single product: "product:id"
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  loading: false,
  error: null,
  categories: [],
  cache: new Map(),

  fetchProducts: async (limit = 10, skip = 0) => {
    const cacheKey = `products:${limit}:${skip}`;
    const cached = get().cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ products: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();

      get().cache.set(cacheKey, {
        data: data.products,
        total: data.total,
        timestamp: Date.now(),
      });

      set({
        products: data.products,
        total: data.total,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      });
    }
  },

  searchProducts: async (query: string) => {
    if (!query.trim()) {
      set({ products: [], total: 0 });
      return;
    }

    const cacheKey = `products:search:${query}`;
    const cached = get().cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ products: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');

      const data = await response.json();

      get().cache.set(cacheKey, {
        data: data.products,
        total: data.total,
        timestamp: Date.now(),
      });

      set({
        products: data.products,
        total: data.total,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to search products',
      });
    }
  },

  filterByCategory: async (category: string, limit = 10, skip = 0) => {
    const cacheKey = `products:category:${category}:${limit}:${skip}`;
    const cached = get().cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ products: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');

      const data = await response.json();

      get().cache.set(cacheKey, {
        data: data.products,
        total: data.total,
        timestamp: Date.now(),
      });

      set({
        products: data.products,
        total: data.total,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products by category',
      });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');

      const categoriesData: Category[] = await response.json();
      // Extract slugs from the category objects
      const categorySlugs = categoriesData.map((cat) => cat.slug);
      set({ categories: categorySlugs });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  getProductById: async (id: number) => {
    const cacheKey = `product:${id}`;
    const cached = get().cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data[0] as Product;
    }

    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');

      const product = await response.json();

      get().cache.set(cacheKey, {
        data: [product],
        total: 1,
        timestamp: Date.now(),
      });

      return product;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch product' });
      return null;
    }
  },

  clearCache: () => {
    set({ cache: new Map() });
  },
}));

