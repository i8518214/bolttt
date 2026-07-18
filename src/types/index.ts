export type PropertyType = 'Apartment' | 'Villa' | 'Studio' | 'House'

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
}

export interface Apartment {
  id: string
  name: string
  type: PropertyType
  city: string
  country: string
  location: string
  pricePerNight: number
  rating: number
  reviewsCount: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  description: string
  shortDescription: string
  amenities: string[]
  images: string[]
  reviews: Review[]
}

export interface Destination {
  id: string
  city: string
  country: string
  image: string
  listingsCount: number
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

export interface Booking {
  id: string
  apartmentId: string
  apartmentName: string
  apartmentImage: string
  location: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
}
