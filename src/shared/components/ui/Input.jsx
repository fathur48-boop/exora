import { forwardRef } from 'react'
import { cn } from '../../utils/cn.js'

const Input = forwardRef(function Input(
  { label, error, hint, leftElement, rightElement, containerClassName, className, id, ...props }, ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-ink-secondary tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftElement && (
          <span className="absolute left-3 flex items-center text-ink-faint pointer-events-none">
            {leftElement}
          </span>
        )}
        <input ref={ref} id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white text-ink text-sm placeholder:text-ink-faint',
            'h-9 px-3 border-surface-border',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400',
            'hover:border-brand-300',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-subtle',
            error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
            leftElement  && 'pl-9',
            rightElement && 'pr-9',
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 flex items-center">{rightElement}</span>
        )}
      </div>
      {error && <p className="text-2xs text-red-500 font-medium">{error}</p>}
      {!error && hint && <p className="text-2xs text-ink-faint">{hint}</p>}
    </div>
  )
})
export default Input
