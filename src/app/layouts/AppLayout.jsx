import { Outlet } from 'react-router-dom'
import DashboardSidebar from '../../features/dashboard/components/DashboardSidebar.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-surface-muted">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
