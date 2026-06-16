import { useEffect, useCallback, useState } from 'react'
import { useSettingsStore } from '../store/settingsStore.js'
import { fetchSettings,saveSettings } from '../services/settingsService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useSettings() {
  const { settings,settingsLoaded,setSettings,setLoading,setError,isLoading,error } = useSettingsStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const load = useCallback(async()=>{setLoading(true);try{setSettings(await fetchSettings())}catch(e){setError(e.message)}},[setSettings,setLoading,setError])
  useEffect(()=>{if(!settingsLoaded)load()},[settingsLoaded,load])
  const save = async(data)=>{setSaving(true);try{setSettings(await saveSettings(data));toast.success('Pengaturan disimpan')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  return { settings,isLoading,saving,error,reload:load,save }
}
