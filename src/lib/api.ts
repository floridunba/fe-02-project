import { Camp, Booking, User } from '@/types/camp'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Campgrounds ──────────────────────────────
export async function getCamps(): Promise<Camp[]> {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds`)
  const data = await res.json()
  return data.data
}

export async function getCampById(id: string): Promise<Camp> {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds/${id}`)
  const data = await res.json()
  return data.data
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

export async function createBooking(token: string, campgroundId: string, checkinDate: string, checkoutDate: string) {
  const res = await fetch(`${BASE_URL}/api/v1/campgrounds/${campgroundId}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ checkinDate, checkoutDate, bookDate: new Date().toISOString() })
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