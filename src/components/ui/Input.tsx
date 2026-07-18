import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <label className="block" htmlFor={id}>
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-700/40 ${
            error ? 'border-red-400' : 'border-slate-300'
          } ${className}`}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </label>
    )
  },
)
Input.displayName = 'Input'
