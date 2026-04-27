import { Camp, Booking, User, CreditCard } from '@/types/camp'

const BASE_URL = 'http://localhost:5001'

// ── Campgrounds ──────────────────────────────
export async function getCamps(): Promise<Camp[]> {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds`)
  const data = await res.json()
  if(!data.success) throw new Error(data.message || 'Can not get Campground');
  return data.data
}

export async function getCampById(id: string): Promise<Camp> {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds/${id}`)
  const data = await res.json()
  return data.data
}

export async function createCamp(token: string, camp: Partial<Camp>) : Promise<Camp> {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(camp)
  })

  const data = await res.json();
  if(!data.success) throw new Error(data.message || 'Can not create new Campground');
  return data;
}

// ── Auth ─────────────────────────────────────
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.msg || 'Login failed')
  return data // { success, token }
}

export async function register(name: string, email: string, tel: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, tel, password, role: 'user' })
  })
  const data = await res.json()
  if (!data.success) throw new Error('Register failed')
  return data
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  return data.data
}

// ── Bookings ──────────────────────────────────
export async function getMyBookings(token: string): Promise<Booking[]> {
  const res = await fetch(`${BASE_URL}/api/v1/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  return data.data
}

export async function createBooking(token: string, campgroundId: string, bookDate: string, duration: number) {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds/${campgroundId}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ bookDate, duration })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Booking failed')
  return data.data
}

export async function deleteBooking(token: string, bookingId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Delete failed')
  return data
}

export async function updateBooking(token: string, bookingId: string, bookDate: string, duration: number) {
  const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ bookDate, duration })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Update failed')
  return data.data
}
// ── Review ──────────────────────────────────
export async function createReview(token: string, campgroundId: string, rating: number, comment: string) {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds/${campgroundId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ rating, comment })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Create review failed')
  return data.data
}

export async function getAllReviews(token: string) {
  const res = await fetch(`${BASE_URL}/api/v1/reviews`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to fetch reviews')
  return data.data
}

export async function getReviews({
  token,
  campgroundId
}: {
  token?: string;
  campgroundId?: string;
}) {
  let res;
  if(token) {
    if(campgroundId) {
      res = await fetch(`${BASE_URL}/api/v1/reviews/${campgroundId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    else {
      res = await fetch(`${BASE_URL}/api/v1/reviews/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }
  else {
    res = await fetch(`${BASE_URL}/api/v1/campgrounds/${campgroundId}/reviews`)
  }

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch reviews')
  return data.data
}

export async function updateReview(token: string, reviewId: string, rating: number, comment: string) {
  const res = await fetch(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ rating, comment })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Update review failed')
  return data
}

export async function deleteReview(token: string, reviewId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Delete review failed')
  return data
}

// ── Credit Cards ──────────────────────────────
export async function getMyCards(token: string): Promise<CreditCard[]> {
  const res = await fetch(`${BASE_URL}/api/v1/cards`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to fetch cards')
  return data.data
}

export async function addCard(token: string, card: {
  cardholderName: string
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  isDefault?: boolean
}): Promise<CreditCard> {
  const res = await fetch(`${BASE_URL}/api/v1/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(card)
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to add card')
  return data.data
}

export async function updateCard(token: string, cardId: string, card: {
  cardholderName?: string
  cardNumber?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault?: boolean
}): Promise<CreditCard> {
  const res = await fetch(`${BASE_URL}/api/v1/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(card)
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to update card')
  return data.data
}

export async function deleteCard(token: string, cardId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/cards/${cardId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to delete card')
  return data
}

export async function setDefaultCard(token: string, cardId: string): Promise<CreditCard> {
  const res = await fetch(`${BASE_URL}/api/v1/cards/${cardId}/default`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to set default card')
  return data.data
}

// ── Payments ──────────────────────────────────
export async function payBooking(token: string, bookingId: string, cardId: string): Promise<Booking> {
  const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ cardId })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Payment failed')
  return data.data
}

export async function getOngoingBooking(token: string): Promise<Booking | null> {
  const res = await fetch(`${BASE_URL}/api/v1/bookings/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) return null
  return data.data
}

export async function resumePayment(token: string, bookingId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}/resume`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Cannot resume payment')
  return data
}

export async function cancelPayment(token: string, bookingId: string): Promise<Booking> {
  const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}/cancel-payment`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Cannot cancel payment')
  return data.data
}
