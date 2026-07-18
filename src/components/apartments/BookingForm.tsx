import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Apartment } from '../../types'
import { useBookings } from '../../context/BookingsContext'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end.getTime() - start.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && aEnd > bStart
}

function formatRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${new Date(start).toLocaleDateString(undefined, opts)} – ${new Date(end).toLocaleDateString(undefined, opts)}`
}

export function BookingForm({ apartment }: { apartment: Apartment }) {
  const navigate = useNavigate()
  const { bookings, addBooking } = useBookings()

  const today = new Date().toISOString().slice(0, 10)

  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const unavailableRanges = useMemo(() => {
    return bookings
      .filter((b) => b.apartmentId === apartment.id && b.status !== 'cancelled' && b.checkOut > today)
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
  }, [bookings, apartment.id, today])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    return nightsBetween(checkIn, checkOut)
  }, [checkIn, checkOut])

  const totalPrice = nights > 0 ? nights * apartment.pricePerNight : 0

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (!guestName.trim()) nextErrors.guestName = 'Full name is required.'
    if (!guestEmail.trim()) {
      nextErrors.guestEmail = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(guestEmail)) {
      nextErrors.guestEmail = 'Enter a valid email address.'
    }
    if (!checkIn) nextErrors.checkIn = 'Check-in date is required.'
    if (!checkOut) nextErrors.checkOut = 'Check-out date is required.'
    if (checkIn && checkIn < today) {
      nextErrors.checkIn = 'Check-in date cannot be in the past.'
    }
    if (checkOut && checkOut < today) {
      nextErrors.checkOut = 'Check-out date cannot be in the past.'
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      nextErrors.checkOut = 'Check-out must be after check-in.'
    }
    if (
      checkIn &&
      checkOut &&
      checkOut > checkIn &&
      unavailableRanges.some((b) => rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut))
    ) {
      nextErrors.availability = 'These dates are already booked. Please choose different dates.'
    }
    if (Number(guests) > apartment.maxGuests) {
      nextErrors.guests = `This property sleeps up to ${apartment.maxGuests} guests.`
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    const booking = addBooking({
      apartmentId: apartment.id,
      apartmentName: apartment.name,
      apartmentImage: apartment.images[0],
      location: apartment.location,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      checkIn,
      checkOut,
      guests: Number(guests),
      totalPrice,
    })

    navigate(`/booking-confirmation/${booking.id}`)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-slate-900">
          ${apartment.pricePerNight}
          <span className="text-base font-normal text-slate-500"> / night</span>
        </p>
        <p className="text-sm text-slate-500">Sleeps up to {apartment.maxGuests}</p>
      </div>

      {unavailableRanges.length > 0 && (
        <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-medium">Already booked</p>
          <ul className="mt-1 space-y-0.5">
            {unavailableRanges.map((b) => (
              <li key={b.id}>{formatRange(b.checkIn, b.checkOut)}</li>
            ))}
          </ul>
        </div>
      )}

      <Input
        label="Full name"
        placeholder="Jane Doe"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        error={errors.guestName}
      />
      <Input
        label="Email"
        type="email"
        placeholder="jane@example.com"
        value={guestEmail}
        onChange={(e) => setGuestEmail(e.target.value)}
        error={errors.guestEmail}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Check-in"
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          error={errors.checkIn}
        />
        <Input
          label="Check-out"
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          error={errors.checkOut}
        />
      </div>
      {errors.availability && <p className="text-xs text-red-600">{errors.availability}</p>}

      <Select label="Guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
        {Array.from({ length: apartment.maxGuests }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n} {n === 1 ? 'guest' : 'guests'}
          </option>
        ))}
      </Select>
      {errors.guests && <p className="text-xs text-red-600">{errors.guests}</p>}

      {nights > 0 && (
        <div className="space-y-1.5 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>
              ${apartment.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <Button type="submit" fullWidth size="lg">
        Book now
      </Button>
      <p className="text-center text-xs text-slate-400">You won&apos;t be charged yet</p>
    </form>
  )
}
