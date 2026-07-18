import { Link, Navigate, useParams } from 'react-router-dom'
import { useBookings } from '../context/BookingsContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { getBooking } = useBookings()
  const booking = bookingId ? getBooking(bookingId) : undefined

  if (!booking) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-9 w-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">Booking confirmed!</h1>
        <p className="mt-2 text-slate-500">
          A confirmation has been sent to {booking.guestEmail}. We can&apos;t wait to host you.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Booking number</p>
            <p className="text-lg font-bold text-slate-900">{booking.id}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex gap-4 py-5">
          <img
            src={booking.apartmentImage}
            alt={booking.apartmentName}
            className="h-20 w-24 flex-shrink-0 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{booking.apartmentName}</p>
            <p className="text-sm text-slate-500">{booking.location}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-slate-200 py-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-slate-500">Check-in</dt>
            <dd className="mt-1 font-medium text-slate-900">{formatDate(booking.checkIn)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Check-out</dt>
            <dd className="mt-1 font-medium text-slate-900">{formatDate(booking.checkOut)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Guests</dt>
            <dd className="mt-1 font-medium text-slate-900">{booking.guests}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Guest name</dt>
            <dd className="mt-1 font-medium text-slate-900">{booking.guestName}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <span className="text-base font-semibold text-slate-900">Total price</span>
          <span className="text-xl font-bold text-slate-900">${booking.totalPrice}</span>
        </div>
      </Card>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/">
          <Button variant="secondary" fullWidth>
            Back to home
          </Button>
        </Link>
        <Link to="/search">
          <Button fullWidth>Browse more stays</Button>
        </Link>
      </div>
    </div>
  )
}
