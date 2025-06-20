export interface Residence {
  id: number
  title: string
  price: number
  location: string
  city: string
  bedrooms: number
  bathrooms: number
  surfaceArea: number
  description: string
  image: { thumbnail: string; medium: string }
  type: string
}
