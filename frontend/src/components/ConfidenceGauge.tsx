import { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import type { ConfidenceGaugeProps } from '../types'

const RADIUS = 54
const STROKE = 10
const VIEWBOX_SIZE = 140

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

const getArcColor = (score: number) => {
  if (score < 0.6) return '#EF4444'
  if (score < 0.85) return '#F59E0B'
  return '#00A86B'
}

export const ConfidenceGauge = ({ score, animated = true }: ConfidenceGaugeProps) => {
  const clampedScore = Math.max(0, Math.min(1, score))
  const [displayScore, setDisplayScore] = useState(animated ? 0 : clampedScore)

  useEffect(() => {
    if (!animated) {
      setDisplayScore(clampedScore)
      return
    }
    const animationFrame = requestAnimationFrame(() => setDisplayScore(clampedScore))
    return () => cancelAnimationFrame(animationFrame)
  }, [animated, clampedScore])

  const percent = Math.round(displayScore * 100)
  const arcPath = useMemo(() => describeArc(70, 70, RADIUS, 180, 0), [])
  const pathLength = useMemo(() => Math.PI * RADIUS, [])
  const dashOffset = pathLength * (1 - displayScore)
  const dynamicArcColor = getArcColor(displayScore)

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg
        width={VIEWBOX_SIZE}
        height={VIEWBOX_SIZE / 2 + 14}
        viewBox="0 0 140 84"
        fill="none"
        role="img"
        aria-label={`AI confidence ${percent}%`}
      >
        <path d={arcPath} stroke="#CBD5E1" strokeWidth={STROKE} strokeLinecap="round" />
        <path
          d={arcPath}
          stroke={dynamicArcColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          className={cn(animated && 'transition-all duration-[1200ms] ease-out')}
        />
      </svg>
      <div className="pointer-events-none absolute top-7 flex flex-col items-center">
        <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {percent}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">AI Confidence</span>
      </div>
    </div>
  )
}

export default ConfidenceGauge
