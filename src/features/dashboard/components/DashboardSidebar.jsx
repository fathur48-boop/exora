import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Target, Package, History,
  FolderOpen, UserCheck, TrendingUp, Settings,
  LogOut, BarChart2, Bot, CalendarCheck, PieChart,
  ShoppingCart, ClipboardList, SlidersHorizontal,
} from 'lucide-react'
import { cn } from '../../../shared/utils/cn.js'
import { useSession }   from '../../auth/hooks/useSession.js'
import { getRoleLabel } from '../../auth/utils/authHelpers.js'

const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Customers',    icon: Users,         to: '/crm/customers' },
      { label: 'Leads',        icon: Target,        to: '/crm/leads'     },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Inventory',    icon: Package,       to: '/inventory'           },
      { label: 'Riwayat Stok', icon: History,       to: '/inventory/movements' },
      { label: 'Finance',      icon: TrendingUp,    to: '/finance'             },
      { label: 'Projects',     icon: FolderOpen,    to: '/projects'            },
    ],
  },
  {
    label: 'POS',
    items: [
      { label: 'Kasir',          icon: ShoppingCart,      to: '/pos'          },
      { label: 'Riwayat Jual',   icon: ClipboardList,     to: '/pos/history'  },
      { label: 'Pengaturan POS', icon: SlidersHorizontal, to: '/pos/settings' },
    ],
  },
  {
    label: 'HR',
    items: [
      { label: 'Karyawan',     icon: UserCheck,     to: '/hr'             },
      { label: 'Kehadiran',    icon: CalendarCheck, to: '/hr/attendance'  },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { label: 'Reports',      icon: BarChart2,     to: '/reports'    },
      { label: 'Analytics',    icon: PieChart,      to: '/analytics'  },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Settings',     icon: Settings,      to: '/settings'   },
    ],
  },
]

export default function DashboardSidebar() {
  const { user, logout } = useSession()

  return (
    <aside className="w-64 sidebar-gradient min-h-screen flex flex-col shrink-0 border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-white/5">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/50">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-extrabold text-sm tracking-wide">EXORA</p>
          <p className="text-brand-400/60 text-2xs">Business OS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-2xs font-bold text-brand-500/50 tracking-widest px-3 mb-1.5">{group.label}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ label, icon: Icon, to }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-brand-600/20 text-white border border-brand-500/20 shadow-sm'
                      : 'text-brand-200/60 hover:bg-white/5 hover:text-brand-100'
                  )}>
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-brand-400' : '')} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* AI Assistant */}
        <div className="mt-2 pt-3 border-t border-white/5">
          <NavLink to="/ai"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-gradient-to-r from-brand-600/30 to-violet-600/30 text-white border border-brand-500/30'
                : 'text-brand-200/60 hover:bg-gradient-to-r hover:from-brand-600/10 hover:to-violet-600/10 hover:text-brand-100'
            )}>
            <Bot className="w-4 h-4 shrink-0 text-violet-400" />
            AI Assistant
            <span className="ml-auto text-2xs bg-gradient-to-r from-brand-500 to-violet-500 text-white px-2 py-0.5 rounded-full font-bold">AI</span>
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.full_name}</p>
            <p className="text-brand-400/60 text-2xs truncate">{getRoleLabel(user?.role)}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-brand-200/50 hover:bg-white/5 hover:text-red-400 transition-all duration-150 mt-1">
          <LogOut className="w-4 h-4 shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
