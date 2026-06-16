import { useState } from 'react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import Spinner            from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody,CardHeader } from '../../../shared/components/ui/Card.jsx'
import CompanyProfileForm from '../components/CompanyProfileForm.jsx'
import AppSettingsForm    from '../components/AppSettingsForm.jsx'
import UserManagement     from '../components/UserManagement.jsx'
import BackendToggle      from '../components/BackendToggle.jsx'
import RoleGuard          from '../../../shared/components/guards/RoleGuard.jsx'
import { useSettings }    from '../hooks/useSettings.js'
import { ROLES }          from '../../../shared/constants/roles.js'

const TABS = [
  { key:'company', label:'Profil Perusahaan' },
  { key:'app',     label:'Pengaturan App'    },
  { key:'users',   label:'Manajemen User', adminOnly:true },
  { key:'backend', label:'Backend', adminOnly:true },
]

export default function SettingsPage() {
  const { settings,isLoading,saving,error,reload,save } = useSettings()
  const [activeTab,setTab] = useState('company')
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Settings" subtitle="Konfigurasi EXORA" onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5 max-w-3xl">
        {error && <Alert type="error" message={error}/>}
        <div className="flex gap-1 border-b border-surface-border">
          {TABS.map(tab=>{
            const button = (
              <button key={tab.key} onClick={()=>setTab(tab.key)} className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab===tab.key?'border-brand-600 text-brand-600':'border-transparent text-ink-muted hover:text-ink'}`}>{tab.label}</button>
            )
            if(tab.adminOnly) return <RoleGuard key={tab.key} roles={[ROLES.SUPER_ADMIN,ROLES.OWNER]}>{button}</RoleGuard>
            return button
          })}
        </div>
        {isLoading && !settings ? <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
        : <>
            {activeTab==='company' && <Card><CardHeader><div><p className="text-sm font-bold text-ink">Profil Perusahaan</p><p className="text-2xs text-ink-faint mt-0.5">Informasi dasar perusahaan Anda</p></div></CardHeader><CardBody><CompanyProfileForm settings={settings} onSave={save} saving={saving}/></CardBody></Card>}
            {activeTab==='app'     && <Card><CardHeader><div><p className="text-sm font-bold text-ink">Pengaturan Aplikasi</p><p className="text-2xs text-ink-faint mt-0.5">Preferensi tampilan dan format data</p></div></CardHeader><CardBody><AppSettingsForm settings={settings} onSave={save} saving={saving}/></CardBody></Card>}
            {activeTab==='users'   && <RoleGuard roles={[ROLES.SUPER_ADMIN,ROLES.OWNER]} fallback={<Alert type="error" title="Akses Ditolak" message="Hanya Super Admin dan Owner yang dapat mengelola user."/>}>
              <Card><CardHeader><div><p className="text-sm font-bold text-ink">Manajemen User</p><p className="text-2xs text-ink-faint mt-0.5">Kelola akun dan hak akses pengguna EXORA</p></div></CardHeader><CardBody><UserManagement/></CardBody></Card>
            </RoleGuard>}
            {activeTab==='backend' && <RoleGuard roles={[ROLES.SUPER_ADMIN,ROLES.OWNER]} fallback={<Alert type="error" title="Akses Ditolak" message="Hanya Super Admin dan Owner yang dapat mengganti backend."/>}>
              <Card><CardHeader><div><p className="text-sm font-bold text-ink">Backend Database</p><p className="text-2xs text-ink-faint mt-0.5">Pilih sumber data: Google Sheets (GAS) atau Supabase</p></div></CardHeader><CardBody><BackendToggle/></CardBody></Card>
            </RoleGuard>}
          </>}
      </div>
    </div>
  )
}
