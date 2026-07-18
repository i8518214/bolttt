import type { PropertyType } from '../../types'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export interface FilterState {
  minPrice: string
  maxPrice: string
  guests: string
  minRating: string
  propertyType: PropertyType | 'all'
}

export const defaultFilters: FilterState = {
  minPrice: '',
  maxPrice: '',
  guests: 'any',
  minRating: 'any',
  propertyType: 'all',
}

const propertyTypes: PropertyType[] = ['Apartment', 'Villa', 'Studio', 'House']

interface FiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
}

export function Filters({ filters, onChange, onReset }: FiltersProps) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-navy-700 hover:text-navy-800"
        >
          Reset
        </button>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Price per night</span>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update('minPrice', e.target.value)}
          />
          <span className="text-slate-400">—</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <Select
        label="Guests"
        value={filters.guests}
        onChange={(e) => update('guests', e.target.value)}
      >
        <option value="any">Any number of guests</option>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <option key={n} value={n}>
            {n}+ guests
          </option>
        ))}
      </Select>

      <Select
        label="Minimum rating"
        value={filters.minRating}
        onChange={(e) => update('minRating', e.target.value)}
      >
        <option value="any">Any rating</option>
        <option value="4.5">4.5+</option>
        <option value="4">4.0+</option>
        <option value="3.5">3.5+</option>
      </Select>

      <Select
        label="Property type"
        value={filters.propertyType}
        onChange={(e) => update('propertyType', e.target.value as FilterState['propertyType'])}
      >
        <option value="all">All types</option>
        {propertyTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <Button variant="secondary" fullWidth onClick={onReset} type="button">
        Clear all filters
      </Button>
    </div>
  )
}
