interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function Rating({ value, count, size = 'md' }: RatingProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses[size]}`}>
      <svg
        aria-hidden="true"
        className="h-4 w-4 flex-shrink-0 text-amber-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
      </svg>
      <span className="font-semibold text-slate-900">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-slate-500">({count})</span>}
    </span>
  )
}
