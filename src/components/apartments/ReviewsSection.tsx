import type { Review } from '../../types'
import { Rating } from '../ui/Rating'

export function ReviewsSection({ reviews, rating, count }: { reviews: Review[]; rating: number; count: number }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <Rating value={rating} count={count} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <img
                src={review.avatar}
                alt={review.author}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{review.author}</p>
                <p className="text-xs text-slate-500">
                  {new Date(review.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
              <div className="ml-auto">
                <Rating value={review.rating} size="sm" />
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
