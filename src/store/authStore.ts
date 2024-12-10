import { create } from 'zustand';

// Define the user type
interface User {
  id: string,
  username: string;
  access_token: string;
  refresh_token: string;
}

// Define the store type
interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  getUser: () => User | null;
  isAuthenticated: () => boolean;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  // Function to log in a user
  login: (userData) => set({ user: userData }),

  // Function to log out the user
  logout: () => set({ user: null }),

  // Getter to return the user data
  getUser: () => get().user,

  // Getter to check if the user is authenticated
  isAuthenticated: () => !!get().user,
}));