import { type ComponentType, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  LogIn,
  Route,
  Ticket,
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { SidebarNavItem, SidebarProps, SidebarRoute } from '../types'

const routeIcons: Record<SidebarRoute, ComponentType<{ className?: string }>> = {
  '/dashboard': LayoutDashboard,
  '/triage': Route,
  '/tickets': Ticket,
  '/queues': ListTodo,
  '/login': LogIn,
}

const getNavItems = (queueCount?: number): SidebarNavItem[] => [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Triage', route: '/triage' },
  { label: 'Tickets', route: '/tickets' },
  { label: 'Queues', route: '/queues', badgeCount: queueCount },
]

export const Sidebar = ({
  activeRoute,
  onNavigate,
  queueCount = 0,
  collapsedByDefault = false,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsedByDefault)
  const navItems = useMemo(() => getNavItems(queueCount), [queueCount])

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-700 bg-[#0A1628] text-white transition-all duration-200 dark:border-slate-700',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4 dark:border-slate-700">
        <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-jade text-sm font-bold text-white">
            J
          </span>
          <div className={cn('transition-all duration-200', isCollapsed && 'hidden')}>
            <p className="text-sm font-semibold tracking-tight text-white">Jade Global</p>
            <p className="text-xs text-slate-300">Service Triage</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed((previous) => !previous)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-[#0D1F3C] text-slate-200 transition-all duration-200 hover:border-brand-jade hover:text-white dark:border-slate-600',
            isCollapsed && 'mx-auto',
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {navItems.map((item) => {
          const Icon = routeIcons[item.route]
          const isActive = activeRoute === item.route

          return (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-jade text-white shadow-sm'
                  : 'text-slate-200 hover:bg-[#0D1F3C] hover:text-white',
                isCollapsed && 'justify-center px-2',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={cn('truncate', isCollapsed && 'hidden')}>{item.label}</span>
              {!isCollapsed && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className="ml-auto rounded-full bg-brand-jade-light/20 px-2 py-0.5 text-xs font-semibold text-brand-jade-light">
                  {item.badgeCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 px-4 py-3">
        <p className={cn('text-xs text-slate-400 transition-all duration-200', isCollapsed && 'hidden')}>
          AI-Powered Service Intelligence
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
