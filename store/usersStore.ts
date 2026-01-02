import { create } from 'zustand';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  domain: string;
  ip: string;
  address: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    postalCode: string;
    state: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    address: {
      address: string;
      city: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      postalCode: string;
      state: string;
    };
    department: string;
    name: string;
    title: string;
  };
  ein: string;
  ssn: string;
  userAgent: string;
}

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  cache: Map<string, { data: User[]; total: number; timestamp: number }>;
  fetchUsers: (limit?: number, skip?: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  getUserById: (id: number) => Promise<User | null>;
  clearCache: () => void;
}

/**
 * Caching Strategy:
 * 
 * We implement client-side caching to:
 * 1. Reduce API calls: Avoid redundant requests for the same data
 * 2. Improve performance: Instant data display for cached results
 * 3. Better UX: Faster page loads and smoother navigation
 * 4. Reduce server load: Less strain on the DummyJSON API
 * 
 * Implementation:
 * - Cache key format: "users:limit:skip" or "users:search:query"
 * - Cache expiration: 5 minutes (300000ms)
 * - Cache stored in Zustand state (in-memory)
 * - Cache cleared on logout or manual clear
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: new Map(),

  fetchUsers: async (limit = 10, skip = 0) => {
    const cacheKey = `users:${limit}:${skip}`;
    const cached = get().cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ users: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      
      // Update cache
      get().cache.set(cacheKey, {
        data: data.users,
        total: data.total,
        timestamp: Date.now(),
      });

      set({
        users: data.users,
        total: data.total,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    }
  },

  searchUsers: async (query: string) => {
    if (!query.trim()) {
      set({ users: [], total: 0 });
      return;
    }

    const cacheKey = `users:search:${query}`;
    const cached = get().cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ users: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search users');

      const data = await response.json();

      // Update cache
      get().cache.set(cacheKey, {
        data: data.users,
        total: data.total,
        timestamp: Date.now(),
      });

      set({
        users: data.users,
        total: data.total,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to search users',
      });
    }
  },

  getUserById: async (id: number) => {
    const cacheKey = `user:${id}`;
    const cached = get().cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data[0] as User;
    }

    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');

      const user = await response.json();

      // Update cache
      get().cache.set(cacheKey, {
        data: [user],
        total: 1,
        timestamp: Date.now(),
      });

      return user;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch user' });
      return null;
    }
  },

  clearCache: () => {
    set({ cache: new Map() });
  },
}));

