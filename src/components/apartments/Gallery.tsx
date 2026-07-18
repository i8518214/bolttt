import { useState } from 'react'

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={images[activeIndex]}
          alt={`${alt} — photo ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg ring-2 transition ${
                index === activeIndex ? 'ring-navy-700' : 'ring-transparent hover:ring-slate-300'
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
