import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

interface SearchFormProps {
  requireDestination?: boolean
  showGuests?: boolean
}

export function SearchForm({ requireDestination = true, showGuests = true }: SearchFormProps = {}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const today = new Date().toISOString().slice(0, 10)

  const [destination, setDestination] = useState(() => searchParams.get('destination') ?? '')
  const [checkIn, setCheckIn] = useState(() => searchParams.get('checkin') ?? '')
  const [checkOut, setCheckOut] = useState(() => searchParams.get('checkout') ?? '')
  const [guests, setGuests] = useState(() => searchParams.get('guests') ?? '2')
  const [error, setError] = useState('')
  const paramsKey = searchParams.toString()

  useEffect(() => {
    setDestination(searchParams.get('destination') ?? '')
    setCheckIn(searchParams.get('checkin') ?? '')
    setCheckOut(searchParams.get('checkout') ?? '')
    setGuests(searchParams.get('guests') ?? '2')
    setError('')
  }, [paramsKey])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (requireDestination && !destination.trim()) {
      setError('Please enter a destination.')
      return
    }
    if (checkIn && checkIn < today) {
      setError('Check-in date cannot be in the past.')
      return
    }
    if (checkOut && checkOut < today) {
      setError('Check-out date cannot be in the past.')
      return
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setError('Check-out date must be after the check-in date.')
      return
    }
    setError('')

    // Start from the current URL params so fields hidden on this variant
    // (e.g. guests on the results page, where the filters sidebar owns it)
    // are carried forward untouched instead of being silently reset.
    const params = new URLSearchParams(searchParams)
    if (destination.trim()) {
      params.set('destination', destination.trim())
    } else {
      params.delete('destination')
    }
    if (checkIn) params.set('checkin', checkIn)
    else params.delete('checkin')
    if (checkOut) params.set('checkout', checkOut)
    else params.delete('checkout')
    if (showGuests) params.set('guests', guests)

    navigate(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-card-hover sm:grid-cols-2 lg:items-end lg:gap-3 lg:p-5 ${
        showGuests ? 'lg:grid-cols-[2fr_1fr_1fr_1fr_auto]' : 'lg:grid-cols-[2fr_1fr_1fr_auto]'
      }`}
    >
      <Input
        label="Destination"
        placeholder="Where are you going?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <Input
        label="Check-in"
        type="date"
        min={today}
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <Input
        label="Check-out"
        type="date"
        min={checkIn || today}
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />
      {showGuests && (
        <Select label="Guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </Select>
      )}
      <Button type="submit" size="lg" className="lg:h-[42px]">
        Search
      </Button>

      {error && (
        <p className="col-span-full text-sm font-medium text-red-600">{error}</p>
      )}
    </form>
  )
}
