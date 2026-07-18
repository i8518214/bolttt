import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Booking, BookingStatus } from '../types'
import { seedBookings } from '../data/bookings'

const STORAGE_KEY = 'stayfinder_bookings'

interface BookingsContextValue {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking
  getBooking: (id: string) => Booking | undefined
  updateBookingStatus: (id: string, status: BookingStatus) => void
  deleteBooking: (id: string) => void
}

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined)

function loadInitialBookings(): Booking[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Booking[]
  } catch {
    // fall through to seed data
  }
  return seedBookings
}

function generateBookingNumber() {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `SF-${random}`
}

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(loadInitialBookings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  }, [bookings])

  function addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
    const newBooking: Booking = {
      ...booking,
      id: generateBookingNumber(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [newBooking, ...prev])
    return newBooking
  }

  function getBooking(id: string) {
    return bookings.find((b) => b.id === id)
  }

  function updateBookingStatus(id: string, status: BookingStatus) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  function deleteBooking(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, getBooking, updateBookingStatus, deleteBooking }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingsContext)
  if (!ctx) throw new Error('useBookings must be used within a BookingsProvider')
  return ctx
}
