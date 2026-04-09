import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getTickets } from '../api/client'
import { cn } from '../lib/utils'
import TriageResultCard from '../components/TriageResultCard'
import type { TicketListItem, TicketsApiResponse, TicketsPageProps, TicketRouting, TriageResult } from '../types'

export interface FiltersState {
  queue: string
  category: string
  dateFrom: string
  dateTo: string
}

interface TicketsPageState {
  queueFilter?: string
  categoryFilter?: string
}

type SortKey = 'id' | 'subject' | 'queue' | 'category' | 'confidence' | 'routing' | 'createdAt'

const routingStyles: Record<TicketRouting, string> = {
  'auto-resolved':
    'bg-brand-jade-muted text-brand-jade border border-brand-jade/30 dark:bg-brand-jade/15 dark:text-brand-jade-light dark:border-brand-jade/30',
  routed:
    'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-warning-amber/15 dark:text-amber-300 dark:border-warning-amber/30',
  escalated:
    'bg-red-50 text-red-700 border border-red-200 dark:bg-danger-red/15 dark:text-red-300 dark:border-danger-red/30',
}

export const mockTickets: TicketListItem[] = [
  {
    id: 'INC-510021',
    subject: 'VPN not connecting after client update',
    queue: 'Infra & Network',
    category: 'Network Services',
    confidence: 0.91,
    routing: 'routed',
    createdAt: '2026-04-09T05:02:00.000Z',
    description: 'Users in EMEA unable to connect to VPN after latest patch.',
    sub_category: 'VPN',
    sop_reference: 'SOP-INFRA-204',
    reasoning: 'High match to known VPN client regression pattern.',
    resolution_steps: ['Verify client version', 'Rollback to stable client', 'Re-authenticate user profile'],
  },
  {
    id: 'INC-510018',
    subject: 'SAP role authorization error on PO creation',
    queue: 'Enterprise Apps',
    category: 'Enterprise Platform',
    confidence: 0.78,
    routing: 'routed',
    createdAt: '2026-04-09T04:58:00.000Z',
    description: 'Purchase order creation blocked for newly onboarded users.',
    sub_category: 'SAP Security',
    sop_reference: 'SOP-SAP-118',
    reasoning: 'Authorization issue mapped to enterprise apps queue ownership.',
    resolution_steps: ['Check user role mapping', 'Trigger role sync job', 'Validate authorization object'],
  },
  {
    id: 'INC-510014',
    subject: 'Outlook crash when opening shared mailbox',
    queue: 'End User Computing',
    category: 'Endpoint Support',
    confidence: 0.56,
    routing: 'escalated',
    createdAt: '2026-04-09T04:44:00.000Z',
    description: 'Consistent crash on latest Outlook build across pilot group.',
    sub_category: 'Email Client',
    sop_reference: 'SOP-EUC-050',
    reasoning: 'Low confidence due to mixed telemetry signals and possible plugin conflict.',
    resolution_steps: ['Disable suspect add-ins', 'Collect crash logs', 'Escalate to workspace engineering'],
  },
  {
    id: 'INC-510009',
    subject: 'Password reset completed successfully',
    queue: 'STACK Service Desk',
    category: 'Access Management',
    confidence: 0.95,
    routing: 'auto-resolved',
    createdAt: '2026-04-09T04:31:00.000Z',
    description: 'Routine password reset request completed via self-service MFA.',
    sub_category: 'Credentials',
    sop_reference: 'SOP-STACK-009',
    reasoning: 'High confidence from clear intent and successful verification events.',
    resolution_steps: ['Validate identity checks', 'Reset credentials', 'Confirm sign-in success'],
  },
  {
    id: 'INC-510003',
    subject: 'Service catalog request stuck in pending approval',
    queue: 'STACK Service Desk',
    category: 'General Incident',
    confidence: 0.84,
    routing: 'routed',
    createdAt: '2026-04-09T04:15:00.000Z',
    description: 'Hardware request not moving after manager approved in portal.',
    sub_category: 'Service Catalog',
    sop_reference: 'SOP-STACK-117',
    reasoning: 'Workflow queue ownership indicates service desk routing.',
    resolution_steps: ['Reconcile workflow state', 'Re-trigger approval sync', 'Notify requester'],
  },
]

export const initialFilters: FiltersState = {
  queue: '',
  category: '',
  dateFrom: '',
  dateTo: '',
}

const normalizeRouting = (value: string): TicketRouting => {
  if (value === 'auto-resolved' || value === 'routed' || value === 'escalated') return value
  return 'routed'
}

const normalizeTicket = (ticket: Record<string, unknown>): TicketListItem => ({
  id: String(ticket.id ?? ticket.ticket_id ?? `INC-${Math.floor(Math.random() * 100000)}`),
  subject: String(ticket.subject ?? 'Untitled ticket'),
  queue: String(ticket.queue ?? 'STACK Service Desk'),
  category: String(ticket.category ?? 'General Incident'),
  confidence: typeof ticket.confidence === 'number' ? ticket.confidence : 0.7,
  routing: normalizeRouting(String(ticket.routing ?? 'routed')),
  createdAt: String(ticket.createdAt ?? ticket.created_at ?? new Date().toISOString()),
  description: typeof ticket.description === 'string' ? ticket.description : '',
  sub_category: typeof ticket.sub_category === 'string' ? ticket.sub_category : '',
  sop_reference: typeof ticket.sop_reference === 'string' ? ticket.sop_reference : '',
  reasoning: typeof ticket.reasoning === 'string' ? ticket.reasoning : '',
  resolution_steps: Array.isArray(ticket.resolution_steps) ? ticket.resolution_steps.map((step) => String(step)) : [],
})

const toTriageResult = (ticket: TicketListItem): TriageResult => ({
  queue: ticket.queue,
  category: ticket.category,
  sub_category: ticket.sub_category ?? 'General',
  resolution_steps:
    ticket.resolution_steps && ticket.resolution_steps.length > 0
      ? ticket.resolution_steps
      : ['Review ticket context', 'Apply SOP resolution', 'Confirm user impact resolved'],
  confidence: ticket.confidence,
  sop_reference: ticket.sop_reference || 'SOP-STACK-100',
  reasoning: ticket.reasoning || 'Queue and routing determined from confidence and historical routing patterns.',
  routing: ticket.routing,
  timestamp: ticket.createdAt,
})

export const TicketsPage = ({ globalSearch = '' }: TicketsPageProps) => {
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(globalSearch)
  const [filters, setFilters] = useState<FiltersState>(initialFilters)
  const [sortBy, setSortBy] = useState<SortKey>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedTicket, setSelectedTicket] = useState<TicketListItem | null>(null)

  const limit = 20

  useEffect(() => {
    const rawState = window.localStorage.getItem('tickets-page-state')
    if (!rawState) return
    try {
      const parsed = JSON.parse(rawState) as TicketsPageState
      setFilters((prev) => ({
        ...prev,
        queue: parsed.queueFilter ?? '',
        category: parsed.categoryFilter ?? '',
      }))
    } catch (storageError) {
      console.error('Failed to parse tickets-page-state:', storageError)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      'tickets-page-state',
      JSON.stringify({ queueFilter: filters.queue, categoryFilter: filters.category }),
    )
  }, [filters.queue, filters.category])

  useEffect(() => {
    setSearch(globalSearch)
  }, [globalSearch])

  useEffect(() => {
    setPage(1)
  }, [search, filters.queue, filters.category, filters.dateFrom, filters.dateTo])

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = (await getTickets({
          page,
          limit,
          queue: filters.queue,
          category: filters.category,
          search,
        })) as TicketsApiResponse

        const incoming = Array.isArray(response?.tickets) ? response.tickets.map((item) => normalizeTicket(item as unknown as Record<string, unknown>)) : []
        const safeTickets = incoming.length > 0 ? incoming : mockTickets
        setTickets(safeTickets)
        setTotal(typeof response?.total === 'number' ? response.total : safeTickets.length)
      } catch (requestError) {
        setTickets(mockTickets)
        setTotal(mockTickets.length)
        setError(requestError instanceof Error ? requestError.message : 'Unable to load tickets.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchTickets()
  }, [page, filters.queue, filters.category, search])

  const filteredByDate = useMemo(() => {
    return tickets.filter((ticket) => {
      const current = new Date(ticket.createdAt).getTime()
      const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : Number.NEGATIVE_INFINITY
      const to = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59`).getTime() : Number.POSITIVE_INFINITY
      return current >= from && current <= to
    })
  }, [filters.dateFrom, filters.dateTo, tickets])

  const sortedTickets = useMemo(() => {
    const list = [...filteredByDate]
    list.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1
      if (sortBy === 'confidence') return (a.confidence - b.confidence) * direction
      if (sortBy === 'createdAt') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction
      return String(a[sortBy]).localeCompare(String(b[sortBy])) * direction
    })
    return list
  }, [filteredByDate, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const queueOptions = Array.from(new Set(mockTickets.map((ticket) => ticket.queue))).sort()
  const categoryOptions = Array.from(new Set(mockTickets.map((ticket) => ticket.category))).sort()

  const handleSort = (column: SortKey) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(column)
    setSortDirection('asc')
  }

  const confidenceBarClass = (confidence: number) => {
    if (confidence >= 0.85) return 'bg-brand-jade'
    if (confidence >= 0.6) return 'bg-warning-amber'
    return 'bg-danger-red'
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <label className="relative lg:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tickets"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-brand-jade focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <select
            value={filters.queue}
            onChange={(event) => setFilters((prev) => ({ ...prev, queue: event.target.value }))}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All Queues</option>
            {queueOptions.map((queue) => (
              <option key={queue} value={queue}>
                {queue}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => setFilters((prev) => ({ ...prev, dateFrom: event.target.value }))}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => setFilters((prev) => ({ ...prev, dateTo: event.target.value }))}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger-red/30 bg-danger-red/10 px-4 py-2 text-sm text-danger-red">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-900">
              <tr>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'queue', label: 'Queue' },
                  { key: 'category', label: 'Category' },
                  { key: 'confidence', label: 'Confidence' },
                  { key: 'routing', label: 'Routing' },
                  { key: 'createdAt', label: 'Date' },
                ].map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key as SortKey)}
                    className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    Loading tickets...
                  </td>
                </tr>
              ) : (
                sortedTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={cn(
                      'cursor-pointer border-t border-slate-200 dark:border-slate-700',
                      index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/60',
                      'hover:bg-slate-100 dark:hover:bg-slate-700/60',
                    )}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-brand-accent">{ticket.id}</td>
                    <td className="max-w-[280px] truncate px-4 py-3 text-slate-700 dark:text-slate-200">{ticket.subject}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{ticket.queue}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{ticket.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className={cn('h-full rounded-full', confidenceBarClass(ticket.confidence))}
                            style={{ width: `${Math.round(ticket.confidence * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-300">{Math.round(ticket.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', routingStyles[ticket.routing])}>
                        {ticket.routing}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedTicket(ticket)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition-all duration-200 hover:border-brand-jade hover:text-brand-jade dark:border-slate-600 dark:text-slate-200"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {Math.min(page * limit, total)} of {total} tickets
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageNumbers.map((pageNo) => (
            <button
              key={pageNo}
              type="button"
              onClick={() => setPage(pageNo)}
              className={cn(
                'h-9 min-w-9 rounded-lg border px-3 text-sm transition-all duration-200',
                page === pageNo
                  ? 'border-brand-jade bg-brand-jade text-white'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200',
              )}
            >
              {pageNo}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Ticket Detail
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all duration-200 hover:border-danger-red hover:text-danger-red dark:border-slate-700 dark:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <p className="font-mono text-xs text-brand-accent">{selectedTicket.id}</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedTicket.subject}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{selectedTicket.description || 'No description available.'}</p>
            </div>

            <TriageResultCard
              result={toTriageResult(selectedTicket)}
              onAccept={() => setSelectedTicket(null)}
              onOverride={() => setSelectedTicket(null)}
              onEscalate={() => setSelectedTicket(null)}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default TicketsPage
