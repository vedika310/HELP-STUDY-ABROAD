import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
}

/**
 * Why Zustand?
 * 
 * Zustand was chosen for this project because:
 * 1. Simplicity: Minimal boilerplate compared to Redux - no actions, reducers, or providers needed
 * 2. Small footprint: ~1KB gzipped, perfect for small-medium apps
 * 3. Built-in async actions: Native support for async operations without middleware
 * 4. TypeScript support: Excellent type inference and type safety
 * 5. No provider hell: Can be used without wrapping the app in providers
 * 6. DevTools: Optional Redux DevTools integration for debugging
 * 7. Persistence: Easy middleware for localStorage/sessionStorage
 * 
 * For this assessment, Zustand is ideal because:
 * - We need simple state management (auth, users, products)
 * - We want async API calls handled cleanly
 * - We want minimal setup overhead
 * - We need localStorage persistence for tokens
 */

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Login failed' };
          }

          const data = await response.json();
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Network error. Please try again.' };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

