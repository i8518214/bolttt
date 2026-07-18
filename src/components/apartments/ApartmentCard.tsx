import { Link } from 'react-router-dom'
import type { Apartment } from '../../types'
import { Card } from '../ui/Card'
import { Rating } from '../ui/Rating'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={apartment.images[0]}
          alt={apartment.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <Badge className="absolute left-3 top-3 bg-white/90">{apartment.type}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{apartment.name}</h3>
          <Rating value={apartment.rating} size="sm" />
        </div>
        <p className="text-sm text-slate-500">{apartment.location}</p>
        <p className="line-clamp-2 text-sm text-slate-600">{apartment.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-sm text-slate-900">
            <span className="text-lg font-bold">${apartment.pricePerNight}</span>{' '}
            <span className="text-slate-500">/ night</span>
          </p>
          <Link to={`/apartments/${apartment.id}`}>
            <Button size="sm">View details</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
