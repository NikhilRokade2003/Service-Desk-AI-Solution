import { Activity, AlertTriangle, ArrowUpRight, Bot, CheckCircle2, Ticket } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '../lib/utils'
import type { DashboardStats, QueueDistributionItem, RecentTicket, TicketRouting } from '../types'

const dashboardStats: DashboardStats = {
  totalTickets: 9442,
  autoResolved: 3847,
  avgConfidence: 0.82,
  escalated: 312,
}

const queueDistribution: QueueDistributionItem[] = [
  { name: 'STACK Service Desk', value: 4581, color: '#00A86B' },
  { name: 'Enterprise Apps', value: 3177, color: '#1E6FFF' },
  { name: 'Infra & Network', value: 1304, color: '#F59E0B' },
  { name: 'End User Computing', value: 185, color: '#8B5CF6' },
  { name: 'Other Queues', value: 195, color: '#94A3B8' },
]

const recentTickets: RecentTicket[] = [
  {
    id: 'INC-509201',
    subject: 'VPN access denied for APAC users after policy update',
    queue: 'Infra & Network',
    category: 'Network Access',
    confidence: 0.88,
    routing: 'routed',
    createdAt: '2026-04-09T04:58:00.000Z',
  },
  {
    id: 'INC-509198',
    subject: 'SAP Fiori tile timeout during invoice approval workflow',
    queue: 'Enterprise Apps',
    category: 'SAP',
    confidence: 0.79,
    routing: 'routed',
    createdAt: '2026-04-09T04:54:00.000Z',
  },
  {
    id: 'INC-509194',
    subject: 'Outlook profile corrupt after mailbox migration',
    queue: 'End User Computing',
    category: 'Email Client',
    confidence: 0.57,
    routing: 'escalated',
    createdAt: '2026-04-09T04:45:00.000Z',
  },
  {
    id: 'INC-509188',
    subject: 'Password reset request with successful MFA verification',
    queue: 'STACK Service Desk',
    category: 'Identity Access',
    confidence: 0.93,
    routing: 'auto-resolved',
    createdAt: '2026-04-09T04:39:00.000Z',
  },
  {
    id: 'INC-509183',
    subject: 'ServiceNow catalog item submission failing for hardware request',
    queue: 'STACK Service Desk',
    category: 'Service Catalog',
    confidence: 0.84,
    routing: 'routed',
    createdAt: '2026-04-09T04:32:00.000Z',
  },
]

const routingStyles: Record<TicketRouting, string> = {
  'auto-resolved':
    'bg-brand-jade-muted text-brand-jade border border-brand-jade/30 dark:bg-brand-jade/15 dark:text-brand-jade-light dark:border-brand-jade/30',
  routed:
    'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-warning-amber/15 dark:text-amber-300 dark:border-warning-amber/30',
  escalated:
    'bg-red-50 text-red-700 border border-red-200 dark:bg-danger-red/15 dark:text-red-300 dark:border-danger-red/30',
}

const kpiCards = [
  {
    key: 'totalTickets',
    label: 'Total Tickets',
    value: dashboardStats.totalTickets.toLocaleString(),
    accent: 'bg-brand-jade',
    icon: Ticket,
    trend: '+4.2%',
  },
  {
    key: 'autoResolved',
    label: 'Auto-Resolved',
    value: dashboardStats.autoResolved.toLocaleString(),
    accent: 'bg-brand-accent',
    icon: CheckCircle2,
    trend: '+2.8%',
  },
  {
    key: 'avgConfidence',
    label: 'Avg Confidence',
    value: `${Math.round(dashboardStats.avgConfidence * 100)}%`,
    accent: 'bg-warning-amber',
    icon: Bot,
    trend: '+1.4%',
  },
  {
    key: 'escalated',
    label: 'Escalated',
    value: dashboardStats.escalated.toLocaleString(),
    accent: 'bg-danger-red',
    icon: AlertTriangle,
    trend: '-0.7%',
  },
] as const

const formatTime = (isoString: string) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const Dashboard = () => {
  const [lastRefresh, setLastRefresh] = useState(() => new Date())
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      setPulse(true)
      setLastRefresh(new Date())
      window.setTimeout(() => setPulse(false), 900)
    }, 30000)

    return () => window.clearInterval(refreshInterval)
  }, [])

  const totalQueueVolume = useMemo(
    () => queueDistribution.reduce((sum, queue) => sum + queue.value, 0),
    [],
  )

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <article
              key={card.key}
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
            >
              <span className={cn('absolute left-0 top-0 h-full w-1', card.accent)} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-text-light dark:text-text-dark">
                    {card.value}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-jade">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {card.trend}
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <article className="xl:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-text-light dark:text-text-dark">
                Recent Tickets
              </h2>
              <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                Last 5 triaged incidents
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span
                className={cn(
                  'inline-flex h-2.5 w-2.5 rounded-full bg-brand-jade',
                  pulse && 'animate-pulse',
                )}
              />
              Live refresh • {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    ID
                  </th>
                  <th className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Subject
                  </th>
                  <th className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Queue
                  </th>
                  <th className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Confidence
                  </th>
                  <th className="py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Routing
                  </th>
                  <th className="py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-100 text-sm last:border-b-0 dark:border-slate-700/70"
                  >
                    <td className="py-3 pr-3 font-mono text-xs text-brand-accent">{ticket.id}</td>
                    <td className="max-w-[280px] truncate py-3 pr-3 text-slate-700 dark:text-slate-200">
                      {ticket.subject}
                    </td>
                    <td className="py-3 pr-3 text-slate-700 dark:text-slate-200">{ticket.queue}</td>
                    <td className="py-3 pr-3 text-slate-700 dark:text-slate-200">
                      {Math.round(ticket.confidence * 100)}%
                    </td>
                    <td className="py-3 pr-3">
                      <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', routingStyles[ticket.routing])}>
                        {ticket.routing}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{formatTime(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
          <h2 className="text-lg font-semibold tracking-tight text-text-light dark:text-text-dark">
            Queue Distribution
          </h2>
          <p className="mb-2 text-sm text-text-secondaryLight dark:text-text-secondaryDark">
            Total volume: {totalQueueVolume.toLocaleString()} tickets
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={queueDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={95}
                  strokeWidth={2}
                >
                  {queueDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} tickets`, 'Volume']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2">
            {queueDistribution.map((queue) => (
              <div key={queue.name} className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: queue.color }} />
                  {queue.name}
                </span>
                <span className="font-medium text-slate-600 dark:text-slate-300">{queue.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <Activity className="h-3.5 w-3.5 text-brand-jade" />
        Dashboard updates every 30 seconds
      </div>
    </section>
  )
}

export default Dashboard
