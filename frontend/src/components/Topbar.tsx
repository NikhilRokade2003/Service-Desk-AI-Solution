import { Bell, LogOut, Moon, Search, Sun } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import { useTheme } from '../providers/ThemeProvider'
import type { TopbarNotification, TopbarProps, TopbarUser } from '../types'

const defaultUser: TopbarUser = {
  name: 'Nikhil Rokade',
  role: 'Service Desk Lead',
  initials: 'NR',
  email: 'nikhil.rokade@jadeglobal.com',
}

const defaultNotifications: TopbarNotification[] = [
  { id: '1', title: 'SLA breach risk in Infra queue', time: '2m ago', unread: true },
  { id: '2', title: 'Auto-resolution confidence increased to 84%', time: '8m ago', unread: true },
  { id: '3', title: 'Enterprise Apps queue reassigned', time: '16m ago' },
]

export const Topbar = ({
  searchValue,
  onSearchChange,
  onLogout,
  user = defaultUser,
  notifications = defaultNotifications,
}: TopbarProps) => {
  const { theme, toggleTheme } = useTheme()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  )

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tickets, queue, SOP reference..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-jade focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:bg-slate-800"
        />
      </div>

      <div className="ml-6 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-brand-jade hover:text-brand-jade dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-brand-jade-light"
          aria-label="Toggle theme"
        >
          <span className="transition-all duration-200">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((previous) => !previous)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-brand-jade hover:text-brand-jade dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-brand-jade-light"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-red px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-2 px-2 py-1">
                <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Notifications
                </p>
              </div>
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className={cn(
                      'w-full rounded-lg px-2 py-2 text-left transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700',
                      notification.unread && 'bg-brand-jade-muted dark:bg-brand-jade/10',
                    )}
                  >
                    <p className="text-sm text-slate-900 dark:text-slate-100">{notification.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((previous) => !previous)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-all duration-200 hover:border-brand-jade dark:border-slate-700 dark:bg-slate-800"
            aria-label="Profile menu"
          >
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-jade text-sm font-semibold text-white">
              {user.initials}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email ?? 'N/A'}</p>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">Role: {user.role}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-red transition-all duration-200 hover:bg-danger-red/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
