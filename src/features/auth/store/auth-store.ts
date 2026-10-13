import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthUser = {
  username: string;
  email: string;
}

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null })
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
      }),
    },
  ),
);
