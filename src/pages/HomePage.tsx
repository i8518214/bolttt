import { Hero } from '../components/home/Hero'
import { PopularDestinations } from '../components/home/PopularDestinations'
import { PopularApartments } from '../components/home/PopularApartments'
import { Features } from '../components/home/Features'

export function HomePage() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <PopularApartments />
      <Features />
    </>
  )
}
