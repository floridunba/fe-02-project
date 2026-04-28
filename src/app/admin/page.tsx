'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getMyBookings, cancelPayment } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Booking } from '@/types/camp'
import PaymentStatusBadge from '@/components/PaymentStatusBadge'

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) { router.push('/auth'); return }
    getMyBookings(token)
      .then(setBookings)
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [router])

  const handleCancelPayment = async (bookingId: string) => {
    const token = getToken()
    if (!token) return
    setCancellingId(bookingId)
    setError('')
    try {
      const updated = await cancelPayment(token, bookingId)
      setBookings(prev => prev.map(b => b._id === updated._id ? updated : b))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to cancel payment')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
          Admin — Manage Payments
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Cancel pending or expired payment bookings
        </p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}

        {!loading && bookings.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No bookings found.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookings.map(b => (
            <div key={b._id} style={{
              background: '#fff',
              border: '1.5px solid #e5e7eb',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#111827', marginBottom: '0.2rem' }}>
                  {b.campground?.name ?? 'Unknown Camp'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.4rem' }}>
                  ID: {b._id.slice(-8).toUpperCase()} · {new Date(b.bookDate).toLocaleDateString()} · {b.duration} night(s)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {b.paymentStatus && <PaymentStatusBadge status={b.paymentStatus} />}
                  {b.paymentExpiresAt && b.paymentStatus === 'pending' && (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Expires: {new Date(b.paymentExpiresAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {(b.paymentStatus === 'pending' || b.paymentStatus === 'expired') && (
                  <button
                    onClick={() => handleCancelPayment(b._id)}
                    disabled={cancellingId === b._id}
                    style={{
                      padding: '0.45rem 1rem',
                      background: cancellingId === b._id ? '#f3f4f6' : '#fef2f2',
                      color: '#ef4444',
                      border: '1.5px solid #fecaca',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: cancellingId === b._id ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s'
                    }}
                  >
                    {cancellingId === b._id ? 'Cancelling…' : 'Cancel Payment'}
                  </button>
                )}
                {b.paymentStatus === 'paid' && (
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>Completed ✓</span>
                )}
                {b.paymentStatus === 'cancelled' && (
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Already cancelled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
