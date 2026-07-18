import type { Booking } from '../../types'
import { StatusBadge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings found"
        description="Try adjusting your search or status filter."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {['Booking #', 'Apartment', 'Guest', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status'].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{booking.id}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.apartmentName}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.guestName}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(booking.checkIn)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(booking.checkOut)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.guests}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                ${booking.totalPrice}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
