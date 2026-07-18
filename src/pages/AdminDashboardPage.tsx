import { useMemo, useState } from 'react'
import { useBookings } from '../context/BookingsContext'
import { BookingsTable } from '../components/admin/BookingsTable'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import type { BookingStatus } from '../types'

export function AdminDashboardPage() {
  const { bookings } = useBookings()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<BookingStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      if (status !== 'all' && booking.status !== status) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const haystack = `${booking.guestName} ${booking.apartmentName}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [bookings, query, status])

  const stats = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }),
    [bookings],
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bookings dashboard</h1>
        <p className="mt-1 text-slate-500">Manage and review all apartment bookings</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total bookings', value: stats.total },
          { label: 'Confirmed', value: stats.confirmed },
          { label: 'Pending', value: stats.pending },
          { label: 'Cancelled', value: stats.cancelled },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by guest name or apartment"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus | 'all')}
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      <BookingsTable bookings={filtered} />
    </div>
  )
}
