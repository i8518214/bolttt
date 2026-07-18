import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className = '', children, ...props }, ref) => {
    return (
      <label className="block" htmlFor={id}>
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
        )}
        <select
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-700/40 ${className}`}
          {...props}
        >
          {children}
        </select>
      </label>
    )
  },
)
Select.displayName = 'Select'
