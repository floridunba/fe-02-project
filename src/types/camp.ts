export interface Room {
  _id: string
  roomType: string;
  description: string;
  price: number;
  capacity: number;
  available: number;
}

export interface Camp {
  _id: string
  name: string
  description: string
  address: string
  district: string
  province: string
  postalcode: string
  tel: string
  region: string
  imgSrc: string[]
  rooms: Room[]
  averageRating: number
  totalReviews: number
}

export interface CreditCard {
  _id: string
  cardholderName: string
  last4: string
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other'
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
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
  paymentStatus: 'pending' | 'paid' | 'cancelled' | 'expired'
  paymentExpiresAt: string
  paymentCard?: CreditCard | string
}

export interface User {
  _id: string
  name: string
  email: string
  tel: string
  role: 'user' | 'admin'
}

export interface Review {
  _id: string
  name: string
  rating: number
  comment: string
  user: {
    _id: string;
    name: string;
    role: string;
  }
  campground: {
    _id: string;
    name: string;
  }
  createdAt: string
}