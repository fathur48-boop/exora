import Button from '../../../../shared/components/ui/Button.jsx'
import { AlertTriangle } from 'lucide-react'
export default function DeleteConfirmModal({ title, description, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-sm p-6 animate-slide-up">
        <div className="flex gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500"/>
          </div>
          <div>
            <p className="text-sm font-bold text-ink">{title}</p>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={isLoading}>Batal</Button>
          <Button variant="danger"    size="sm" onClick={onConfirm} loading={isLoading}>Hapus</Button>
        </div>
      </div>
    </div>
  )
}
