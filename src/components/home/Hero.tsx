import { SearchForm } from './SearchForm'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <img
        src="https://picsum.photos/seed/stayfinder-hero/1600/900"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/80 to-navy-900" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Find your perfect stay, anywhere in the world
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Handpicked apartments, villas, and homes for every kind of trip.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <SearchForm />
        </div>
      </div>
    </section>
  )
}
