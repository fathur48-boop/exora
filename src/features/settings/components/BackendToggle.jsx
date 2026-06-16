import { useState } from 'react'
import { Database, Cloud, CheckCircle2 } from 'lucide-react'
import { useBackendStore, BACKENDS } from '../../../shared/lib/backendStore.js'
import { useAuthStore } from '../../auth/store/authStore.js'
import { cn } from '../../../shared/utils/cn.js'
import Alert from '../../../shared/components/ui/Alert.jsx'

const OPTIONS = [
  {
    value: BACKENDS.GAS,
    title: 'Google Apps Script + Sheets',
    description: 'Database menggunakan Google Sheets, backend via Apps Script Web App.',
    icon: Database,
  },
  {
    value: BACKENDS.SUPABASE,
    title: 'Supabase',
    description: 'Database Postgres terkelola, autentikasi via Supabase Auth.',
    icon: Cloud,
  },
]

export default function BackendToggle() {
  const { backend, setBackend } = useBackendStore()
  const [pending, setPending] = useState(null)

  const handleSelect = (value) => {
    if (value === backend) return
    setPending(value)
  }

  const confirmSwitch = () => {
    setBackend(pending)
    useAuthStore.getState().clearSession()
    setPending(null)
    // Reload so all stores/sessions re-initialize against the new backend
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert
        type="warning"
        title="Perhatian"
        message="Mengganti backend akan logout sesi saat ini dan memuat ulang halaman. Data TIDAK otomatis pindah antar backend — pastikan database tujuan sudah disiapkan (lihat supabase/schema.sql)."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          const active = backend === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                'flex flex-col gap-2 p-4 rounded-xl border text-left transition-all',
                active ? 'border-brand-400 bg-brand-50/60 ring-2 ring-brand-500/20' : 'border-surface-border bg-white hover:border-brand-200 hover:bg-surface-muted'
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', active ? 'bg-brand-100 text-brand-600' : 'bg-surface-subtle text-ink-faint')}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                {active && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </div>
              <p className="text-sm font-bold text-ink">{opt.title}</p>
              <p className="text-2xs text-ink-faint leading-relaxed">{opt.description}</p>
            </button>
          )
        })}
      </div>

      {pending && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-sm text-ink">
            Ganti backend ke <strong>{OPTIONS.find(o => o.value === pending)?.title}</strong>? Halaman akan dimuat ulang dan kamu perlu login kembali.
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setPending(null)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-muted hover:bg-white transition-colors">Batal</button>
            <button onClick={confirmSwitch} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors">Ya, ganti backend</button>
          </div>
        </div>
      )}

      <div className="text-2xs text-ink-faint border-t border-surface-border pt-3">
        Backend aktif saat ini: <span className="font-bold text-ink">{backend === BACKENDS.SUPABASE ? 'Supabase' : 'Google Apps Script'}</span>
      </div>
    </div>
  )
}
