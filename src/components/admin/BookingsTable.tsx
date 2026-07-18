import type { Booking, BookingStatus } from '../../types'
import { useBookings } from '../../context/BookingsContext'
import { StatusBadge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'cancelled']

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const { updateBookingStatus, deleteBooking } = useBookings()

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings found"
        description="Try adjusting your search or status filter."
      />
    )
  }

  function handleDelete(booking: Booking) {
    const confirmed = window.confirm(
      `Delete booking ${booking.id} for ${booking.guestName}? This cannot be undone.`,
    )
    if (confirmed) deleteBooking(booking.id)
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {['Booking #', 'Apartment', 'Guest', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status', 'Actions'].map(
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
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-2">
                  <select
                    aria-label={`Change status for booking ${booking.id}`}
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatus)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-700/40"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(booking)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
