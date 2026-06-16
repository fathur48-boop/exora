import { forwardRef } from 'react'
import Spinner from './Spinner.jsx'
import { cn } from '../../utils/cn.js'

const variants = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-ink border border-surface-border hover:bg-surface-muted hover:border-brand-300 shadow-sm',
  ghost:     'text-ink-muted hover:bg-surface-subtle hover:text-ink',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  link:      'text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline p-0 h-auto',
  outline:   'border border-brand-300 text-brand-700 hover:bg-brand-50',
}
const sizes = {
  sm:   'h-8  px-3  text-xs  gap-1.5 rounded-lg',
  md:   'h-9  px-4  text-sm  gap-2   rounded-lg',
  lg:   'h-11 px-6  text-sm  gap-2   rounded-xl font-semibold',
  icon: 'h-9  w-9   text-sm  rounded-lg',
}

const Button = forwardRef(function Button(
  { variant='primary', size='md', loading=false, disabled=false, leftIcon, rightIcon, className, children, ...props }, ref
) {
  const isDisabled = disabled || loading
  return (
    <button ref={ref} disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        variants[variant], sizes[size], className
      )}
      {...props}>
      {loading ? <Spinner size="sm" className={children ? 'mr-1.5' : ''} />
               : leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
})
export default Button
