import { Link } from 'react-router-dom'
import { apartments } from '../../data/apartments'
import { ApartmentCard } from '../apartments/ApartmentCard'
import { Button } from '../ui/Button'

const featured = [...apartments].sort((a, b) => b.rating - a.rating).slice(0, 6)

export function PopularApartments() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Popular apartments</h2>
            <p className="mt-1 text-slate-500">Top-rated stays chosen by our guests</p>
          </div>
          <Link to="/search" className="hidden sm:block">
            <Button variant="secondary">View all</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/search">
            <Button variant="secondary">View all</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
