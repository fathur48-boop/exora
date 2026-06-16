import { create } from 'zustand'
const WELCOME = {
  id:'welcome', role:'assistant', isError:false, timestamp:new Date().toISOString(),
  content:'Halo! Saya EXORA AI, asisten bisnis Anda. Saya memiliki akses ke data bisnis Anda secara real-time. Tanyakan apa saja — mulai dari kondisi keuangan, status leads, performa proyek, hingga saran strategis.',
}
export const useAiStore = create((set,get) => ({
  messages:[WELCOME], isLoading:false, error:null,
  addMessage: (m)  => set({ messages:[...get().messages, m] }),
  setLoading: (v)  => set({ isLoading:v }),
  setError:   (e)  => set({ error:e, isLoading:false }),
  clearError: ()   => set({ error:null }),
  clearChat:  ()   => set({ messages:[WELCOME], isLoading:false, error:null }),
}))
