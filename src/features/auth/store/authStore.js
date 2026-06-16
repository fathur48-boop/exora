import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const INITIAL = { user: null, token: null, isAuthenticated: false, isHydrated: false }

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...INITIAL,
      setSession: ({ user, token }) => set({ user, token, isAuthenticated: true, isHydrated: true }),
      clearSession: () => set({ ...INITIAL, isHydrated: true }),
      setHydrated:  () => set({ isHydrated: true }),
      updateUser:   (partial) => {
        const current = get().user
        if (!current) return
        set({ user: { ...current, ...partial } })
      },
    }),
    {
      name: 'exora_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
      onRehydrateStorage: () => (state) => { if (state) state.setHydrated() },
    }
  )
)
