export interface Camp {
  _id: string
  name: string
  address: string
  district: string
  province: string
  postalcode: string
  tel: string
  region: string
  averageRating: number
  totalReviews: number
}

export interface Booking {
  _id: string
  bookDate: string
  duration: number
  user: string
  campground: {
    _id: string
    name: string
    address: string
    tel: string
  }
  createdAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  tel: string
  role: 'user' | 'admin'
}