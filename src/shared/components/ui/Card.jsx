import { cn } from '../../utils/cn.js'
export default function Card({ className, children, ...props }) {
  return (
    <div className={cn('bg-white border border-surface-border rounded-xl shadow-card', className)} {...props}>
      {children}
    </div>
  )
}
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-b border-surface-border flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}
export function CardBody({ className, children, ...props }) {
  return <div className={cn('px-6 py-5', className)} {...props}>{children}</div>
}
export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-t border-surface-border bg-surface-muted/50 rounded-b-xl', className)} {...props}>
      {children}
    </div>
  )
}
