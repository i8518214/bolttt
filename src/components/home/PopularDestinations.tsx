import { Link } from 'react-router-dom'
import { destinations } from '../../data/destinations'

export function PopularDestinations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Popular destinations</h2>
          <p className="mt-1 text-slate-500">Explore the places travelers love most</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {destinations.map((destination) => (
          <Link
            key={destination.id}
            to={`/search?destination=${encodeURIComponent(destination.city)}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <img
              src={destination.image}
              alt={destination.city}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-sm font-semibold text-white">{destination.city}</p>
              <p className="text-xs text-slate-200">{destination.listingsCount} stays</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
