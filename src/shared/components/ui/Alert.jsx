import { cn } from '../../utils/cn.js'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
const config = {
  error:   { icon: AlertCircle,   classes: 'bg-red-50 border-red-200 text-red-800'     },
  success: { icon: CheckCircle2,  classes: 'bg-green-50 border-green-200 text-green-800'},
  info:    { icon: Info,          classes: 'bg-blue-50 border-blue-200 text-blue-800'  },
  warning: { icon: AlertTriangle, classes: 'bg-amber-50 border-amber-200 text-amber-800'},
}
export default function Alert({ type='info', title, message, className }) {
  const { icon: Icon, classes } = config[type]
  return (
    <div className={cn('flex gap-3 p-4 rounded-xl border text-sm', classes, className)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5">
        {title   && <p className="font-semibold">{title}</p>}
        {message && <p className="opacity-80 text-xs">{message}</p>}
      </div>
    </div>
  )
}
