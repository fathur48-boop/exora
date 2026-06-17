import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const BACKENDS = Object.freeze({
  GAS: 'gas',
  SUPABASE: 'supabase',
})

export const useBackendStore = create(
  persist(
    (set, get) => ({
      backend: BACKENDS.SUPABASE,
      setBackend: (backend) => set({ backend }),
      isSupabase: () => get().backend === BACKENDS.SUPABASE,
      isGas: () => get().backend === BACKENDS.GAS,
    }),
    {
      name: 'exora_backend',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: () => ({ backend: BACKENDS.SUPABASE }),
    }
  )
)

// Non-reactive getter for use inside services/adapters
export function getActiveBackend() {
  return useBackendStore.getState().backend
}
