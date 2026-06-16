import { Toaster } from 'sonner'

export default function AppProviders({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gap={8}
        toastOptions={{
          duration: 3500,
          classNames: {
            toast:       'font-sans text-sm shadow-modal border border-surface-border rounded-xl !bg-white',
            title:       'text-ink font-semibold',
            description: 'text-ink-muted text-xs',
            success:     '!border-l-4 !border-l-green-500',
            error:       '!border-l-4 !border-l-red-500',
            info:        '!border-l-4 !border-l-brand-500',
          },
        }}
      />
    </>
  )
}
