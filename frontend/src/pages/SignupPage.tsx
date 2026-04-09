import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'
import type { LoginCredentials, SignupPageProps } from '../types'
import jadeLogo from '../../Jade_logo.png'
import aiArtwork from '../../ai.png'

const initialCredentials: LoginCredentials = {
  email: '',
  password: '',
}

export const SignupPage = ({ isLoading = false, onSignup }: SignupPageProps) => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<LoginCredentials>(initialCredentials)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isStrongPassword = (value: string) =>
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z\d]/.test(value) &&
    value.length >= 8

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!credentials.email || !credentials.password) {
      setError('Email and password are required.')
      return
    }
    if (!isValidEmail(credentials.email)) {
      setError('Please enter a valid email with @ and domain (example: name@jadeglobal.com).')
      return
    }
    if (!isStrongPassword(credentials.password)) {
      setError('Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.')
      return
    }
    if (credentials.password !== confirmPassword) {
      setError('Password and confirm password do not match.')
      return
    }

    try {
      await onSignup(credentials)
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Unable to sign up. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1117] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,139,253,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(35,134,54,0.22),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] opacity-20" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-transparent p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 opacity-35">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-jade/20 blur-3xl" />
          <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-brand-accent/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] bg-[length:26px_26px] animate-pulse-slow" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 inline-flex items-center rounded-2xl border border-white/20 bg-white/[0.06] px-8 py-4 backdrop-blur">
            <img src={jadeLogo} alt="Jade Global logo" className="h-20 w-auto rounded-xl object-contain" />
          </div>
          <h1 className="max-w-lg text-4xl font-bold tracking-tight text-white">
            Create your Service Desk account
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-300">
            Onboard quickly and start using AI-assisted triage, queue routing, and SOP-driven recommendations.
          </p>

          <div className="mt-5 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
              <p className="text-[11px] text-slate-300">Trusted by teams</p>
              <p className="mt-1 text-lg font-semibold text-white">9+ Queues</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
              <p className="text-[11px] text-slate-300">SOP coverage</p>
              <p className="mt-1 text-lg font-semibold text-white">160+ Flows</p>
            </div>
          </div>

          <div className="relative mt-7 rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_45%,rgba(16,185,129,0.33),transparent_62%)]" />
            <img
              src={aiArtwork}
              alt="AI assistant visual"
              className="relative mx-auto h-[22rem] w-[22rem] bg-transparent object-contain drop-shadow-[0_28px_70px_rgba(16,185,129,0.6)]"
            />
          </div>
        </div>

        <div className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-slate-200 backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-jade-light" />
          Powered by Infra Automation Hub
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-text-light dark:text-text-dark">
              Sign up for Service Desk Triage
            </h2>
            <p className="mt-1 text-sm text-text-secondaryLight dark:text-text-secondaryDark">
              Register with your Jade Global enterprise email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials((previous) => ({ ...previous, email: event.target.value }))
                }
                placeholder="you@jadeglobal.com"
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-jade focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(event) =>
                    setCredentials((previous) => ({ ...previous, password: event.target.value }))
                  }
                  placeholder="Create a password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-jade focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-slate-500 transition-all duration-200 hover:text-brand-jade dark:text-slate-400 dark:hover:text-brand-jade-light"
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm Password</span>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-jade focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-slate-500 transition-all duration-200 hover:text-brand-jade dark:text-slate-400 dark:hover:text-brand-jade-light"
                  aria-label={isConfirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {isConfirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Password must include at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, and be 8+ characters.
            </div>

            {error && (
              <div className="rounded-lg border border-danger-red/30 bg-danger-red/10 px-3 py-2 text-sm text-danger-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-jade px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-jade-light disabled:cursor-not-allowed disabled:opacity-70',
              )}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Back to Login
            </button>
          </form>

        </div>
      </section>
      </div>
    </div>
  )
}

export default SignupPage
