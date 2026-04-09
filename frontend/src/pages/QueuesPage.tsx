import { Clock3, Gauge, Siren, Users } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '../lib/utils'
import type { QueueCardData } from '../types'

interface QueuesPageProps {
  onViewQueue: (queueName: string) => void
}

const queueCards: QueueCardData[] = [
  {
    name: 'STACK Service Desk',
    ticketCount: 4581,
    avgConfidence: 0.88,
    topCategory: 'Access Management',
    trend: [612, 588, 640, 623, 671, 648, 699],
  },
  {
    name: 'Enterprise Apps',
    ticketCount: 3177,
    avgConfidence: 0.82,
    topCategory: 'SAP',
    trend: [421, 437, 429, 454, 468, 446, 479],
  },
  {
    name: 'Infra & Network',
    ticketCount: 1304,
    avgConfidence: 0.74,
    topCategory: 'VPN',
    trend: [179, 166, 194, 183, 201, 189, 192],
  },
  {
    name: 'End User Computing',
    ticketCount: 185,
    avgConfidence: 0.69,
    topCategory: 'Email Client',
    trend: [22, 19, 27, 24, 29, 25, 31],
  },
  {
    name: 'Other Queues',
    ticketCount: 195,
    avgConfidence: 0.63,
    topCategory: 'General Incident',
    trend: [31, 24, 28, 22, 34, 26, 30],
  },
]

const weekLabels = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7']

const summaryData = {
  totalOpen: queueCards.reduce((sum, queue) => sum + queue.ticketCount, 0),
  slaBreached: 127,
  avgResolutionHours: 3.8,
}

const confidenceTone = (score: number) => {
  if (score >= 0.85) return 'text-brand-jade'
  if (score >= 0.6) return 'text-warning-amber'
  return 'text-danger-red'
}

export const QueuesPage = ({ onViewQueue }: QueuesPageProps) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Open</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {summaryData.totalOpen.toLocaleString()}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Users className="h-3.5 w-3.5 text-brand-accent" />
            Active queue load
          </span>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
          <p className="text-sm text-slate-500 dark:text-slate-400">SLA Breached</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-danger-red">
            {summaryData.slaBreached}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Siren className="h-3.5 w-3.5 text-danger-red" />
            Needs urgent attention
          </span>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg Resolution Time</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {summaryData.avgResolutionHours}h
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock3 className="h-3.5 w-3.5 text-brand-jade" />
            Last 7 days
          </span>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {queueCards.map((queue) => {
          const chartData = queue.trend.map((value, index) => ({ day: weekLabels[index], value }))
          return (
            <article
              key={queue.name}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {queue.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Top category: {queue.topCategory}</p>
                </div>
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  {queue.ticketCount.toLocaleString()} tickets
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Avg Confidence</p>
                  <p className={cn('mt-1 font-semibold', confidenceTone(queue.avgConfidence))}>
                    {Math.round(queue.avgConfidence * 100)}%
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Top Category</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{queue.topCategory}</p>
                </div>
              </div>

              <div className="mb-4 h-28 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/50">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} stroke="#94A3B8" />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number) => [`${value} tickets`, 'Volume']}
                      contentStyle={{
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <Bar dataKey="value" fill="#00A86B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.localStorage.setItem(
                    'tickets-page-state',
                    JSON.stringify({ queueFilter: queue.name, categoryFilter: '' }),
                  )
                  onViewQueue(queue.name)
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-jade bg-brand-jade px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-jade-light"
              >
                <Gauge className="h-4 w-4" />
                View Queue
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default QueuesPage
