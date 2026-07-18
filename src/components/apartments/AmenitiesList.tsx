export function AmenitiesList({ amenities }: { amenities: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-navy-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.5 12.75 9 17.25 19.5 6.75"
            />
          </svg>
          {amenity}
        </div>
      ))}
    </div>
  )
}
