import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apartments } from '../data/apartments'
import { ApartmentCard } from '../components/apartments/ApartmentCard'
import { ApartmentCardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Filters, defaultFilters, type FilterState } from '../components/search/Filters'
import { Button } from '../components/ui/Button'
import { SearchForm } from '../components/home/SearchForm'
import { useBookings } from '../context/BookingsContext'

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && aEnd > bStart
}

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { bookings } = useBookings()
  const destination = searchParams.get('destination') ?? ''
  const checkIn = searchParams.get('checkin') ?? ''
  const checkOut = searchParams.get('checkout') ?? ''
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    guests: searchParams.get('guests') ?? defaultFilters.guests,
  }))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [searchParams, filters])

  const results = useMemo(() => {
    return apartments.filter((apartment) => {
      if (destination) {
        const query = destination.trim().toLowerCase()
        const haystack = `${apartment.city} ${apartment.country} ${apartment.location}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      if (filters.minPrice && apartment.pricePerNight < Number(filters.minPrice)) return false
      if (filters.maxPrice && apartment.pricePerNight > Number(filters.maxPrice)) return false
      if (filters.guests !== 'any' && apartment.maxGuests < Number(filters.guests)) return false
      if (filters.minRating !== 'any' && apartment.rating < Number(filters.minRating)) return false
      if (filters.propertyType !== 'all' && apartment.type !== filters.propertyType) return false
      if (
        checkIn &&
        checkOut &&
        checkOut > checkIn &&
        bookings.some(
          (booking) =>
            booking.apartmentId === apartment.id &&
            booking.status !== 'cancelled' &&
            rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut),
        )
      ) {
        return false
      }
      return true
    })
  }, [bookings, checkIn, checkOut, destination, filters])

  function clearSearch() {
    const params = new URLSearchParams(searchParams)
    params.delete('destination')
    params.delete('checkin')
    params.delete('checkout')
    params.delete('guests')
    setSearchParams(params)
  }

  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <SearchForm requireDestination={false} showGuests={false} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {destination ? `Stays in ${destination}` : 'All available apartments'}
          </h1>
          <p className="mt-1 text-slate-500">
            {isLoading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'property' : 'properties'} found`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside>
            <Filters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
            />
          </aside>

          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ApartmentCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                title="No apartments match your search"
                description="Try adjusting your filters or searching for a different destination."
                action={
                  <Button
                    variant="secondary"
                  onClick={() => {
                    setFilters(defaultFilters)
                    clearSearch()
                  }}
                >
                    Clear search and filters
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((apartment) => (
                  <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
