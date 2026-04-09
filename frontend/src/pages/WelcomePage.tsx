import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import jadeLogo from '../../Jade_logo.png'

export const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1117] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,139,253,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(35,134,54,0.22),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10">
        <header className="mb-10 flex items-center justify-between">
          <div className="inline-flex items-center rounded-2xl border border-white/20 bg-white/[0.06] px-8 py-4 backdrop-blur">
            <img src={jadeLogo} alt="Jade Global logo" className="h-20 w-auto rounded-xl object-contain" />
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Under Development
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs text-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              AI-Powered Service Intelligence
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
              Built for teams that
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                resolve incidents faster
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
              The Jade Service Desk AI platform helps you triage, route, and resolve support tickets with confidence.
              Start by signing in, or create a new account to onboard your team.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-500/40 bg-slate-100 px-6 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-white"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-500/40 bg-slate-900/60 px-6 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-slate-300 hover:bg-slate-800"
              >
                Sign Up
              </button>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-[#161b22] px-4 py-3">
                <p className="text-xs text-slate-400">Routing confidence</p>
                <p className="mt-1 text-xl font-semibold text-slate-100">92.4%</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-[#161b22] px-4 py-3">
                <p className="text-xs text-slate-400">Avg. triage time</p>
                <p className="mt-1 text-xl font-semibold text-slate-100">18 sec</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-blue-500/20 blur-2xl" />
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="rounded-2xl border border-slate-700 bg-[#161b22]/90 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
              <p className="mb-4 text-sm font-medium text-slate-200">Platform preview</p>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-700 bg-[#0d1117] px-3 py-3">
                  <p className="text-xs text-slate-400">Total tickets</p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">9,442</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-[#0d1117] px-3 py-3">
                  <p className="text-xs text-slate-400">Auto resolved</p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">61%</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-700 bg-[#0d1117] p-4">
                <p className="text-xs text-slate-400">Recent activity</p>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <p>• VPN incident routed to Infra & Network</p>
                  <p>• SAP access issue escalated with context</p>
                  <p>• Password reset auto-resolved via SOP</p>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs text-slate-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                Powered by Infra Automation Hub
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
