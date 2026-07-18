import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getApartmentById } from '../data/apartments'
import { Gallery } from '../components/apartments/Gallery'
import { AmenitiesList } from '../components/apartments/AmenitiesList'
import { ReviewsSection } from '../components/apartments/ReviewsSection'
import { BookingForm } from '../components/apartments/BookingForm'
import { Rating } from '../components/ui/Rating'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'

export function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [id])

  const apartment = id ? getApartmentById(id) : undefined

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-96 w-full" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    )
  }

  if (!apartment) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{apartment.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{apartment.location}</span>
          <span className="text-slate-300">•</span>
          <Rating value={apartment.rating} count={apartment.reviewsCount} />
          <span className="text-slate-300">•</span>
          <span>{apartment.type}</span>
        </div>
      </div>

      <Gallery images={apartment.images} alt={apartment.name} />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">About this place</h2>
            <p className="leading-relaxed text-slate-600">{apartment.description}</p>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <dt className="text-slate-500">Guests</dt>
                <dd className="mt-1 text-base font-semibold text-slate-900">{apartment.maxGuests}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <dt className="text-slate-500">Bedrooms</dt>
                <dd className="mt-1 text-base font-semibold text-slate-900">{apartment.bedrooms}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <dt className="text-slate-500">Bathrooms</dt>
                <dd className="mt-1 text-base font-semibold text-slate-900">{apartment.bathrooms}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Amenities</h2>
            <AmenitiesList amenities={apartment.amenities} />
          </section>

          <section>
            <ReviewsSection
              reviews={apartment.reviews}
              rating={apartment.rating}
              count={apartment.reviewsCount}
            />
          </section>
        </div>

        <div>
          <Card className="sticky top-24 p-5">
            <BookingForm apartment={apartment} />
          </Card>
        </div>
      </div>
    </div>
  )
}
