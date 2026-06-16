import { useRef, useState } from 'react'
import { Download, Upload, FileDown } from 'lucide-react'
import Button from './Button.jsx'
import { exportRows, downloadTemplate, parseImportFile } from '../../lib/excelUtils.js'
import { useToast } from '../../hooks/useToast.js'

/**
 * Reusable Export / Template / Import bar for list pages.
 *
 * @param {object} props
 * @param {Array<object>} props.data       - rows currently shown (for export)
 * @param {Array<{key:string,label:string}>} props.columns - field <-> column mapping
 * @param {string} props.filename          - base filename (no extension)
 * @param {(rows: Array<object>) => Promise<Array<{ok:boolean,error?:string}>>} props.onImport
 */
export default function ExportImportBar({ data, columns, filename, onImport }) {
  const fileRef = useRef(null)
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const handleExport = () => {
    if (!data?.length) { toast.error('Tidak ada data untuk di-export'); return }
    exportRows(data, columns, filename)
  }

  const handleTemplate = () => downloadTemplate(columns, filename)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const rows = await parseImportFile(file, columns)
      const results = await onImport(rows)
      const success = results.filter(r => r.ok).length
      const failed = results.filter(r => !r.ok)
      if (success) toast.success(`${success} baris berhasil diimport`)
      if (failed.length) toast.error(`${failed.length} baris gagal: ${failed[0].error}`)
    } catch (err) {
      toast.error('Gagal membaca file: ' + err.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4"/>} onClick={handleExport}>Export</Button>
      <Button variant="secondary" size="sm" leftIcon={<FileDown className="w-4 h-4"/>} onClick={handleTemplate}>Template</Button>
      <Button variant="secondary" size="sm" leftIcon={<Upload className="w-4 h-4"/>} loading={busy} onClick={() => fileRef.current?.click()}>Import</Button>
      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
    </div>
  )
}
