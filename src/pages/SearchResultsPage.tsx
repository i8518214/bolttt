import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apartments } from '../data/apartments'
import { ApartmentCard } from '../components/apartments/ApartmentCard'
import { ApartmentCardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Filters, defaultFilters, type FilterState } from '../components/search/Filters'
import { Button } from '../components/ui/Button'

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const destination = searchParams.get('destination') ?? ''
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
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
      return true
    })
  }, [destination, filters])

  function clearDestination() {
    const params = new URLSearchParams(searchParams)
    params.delete('destination')
    setSearchParams(params)
  }

  return (
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
                    clearDestination()
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
  )
}
