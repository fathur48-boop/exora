import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const BACKENDS = Object.freeze({
  GAS: 'gas',
  SUPABASE: 'supabase',
})

export const useBackendStore = create(
  persist(
    (set, get) => ({
      backend: BACKENDS.GAS,
      setBackend: (backend) => set({ backend }),
      isSupabase: () => get().backend === BACKENDS.SUPABASE,
      isGas: () => get().backend === BACKENDS.GAS,
    }),
    {
      name: 'exora_backend',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Non-reactive getter for use inside services/adapters
export function getActiveBackend() {
  return useBackendStore.getState().backend
}
