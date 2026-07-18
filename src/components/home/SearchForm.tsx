import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

export function SearchForm() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!destination.trim()) {
      setError('Please enter a destination.')
      return
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setError('Check-out date must be after the check-in date.')
      return
    }
    setError('')

    const params = new URLSearchParams()
    params.set('destination', destination.trim())
    if (checkIn) params.set('checkin', checkIn)
    if (checkOut) params.set('checkout', checkOut)
    params.set('guests', guests)

    navigate(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-card-hover sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-3 lg:p-5"
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
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <Input
        label="Check-out"
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />
      <Select label="Guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <option key={n} value={n}>
            {n} {n === 1 ? 'guest' : 'guests'}
          </option>
        ))}
      </Select>
      <Button type="submit" size="lg" className="lg:h-[42px]">
        Search
      </Button>

      {error && (
        <p className="col-span-full text-sm font-medium text-red-600">{error}</p>
      )}
    </form>
  )
}
