'use client'
import React, { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createBooking, updateBooking, getMyCards, addCard, payBooking } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Booking, CreditCard } from '@/types/camp'
import styles from '../page.module.css'
import CampgroundDetailPage from '@/components/CampgroundDetailPage'
import PaymentStep from '@/components/PaymentStep'

type Step = 'detail' | 'payment' | 'done'

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const bookingId = searchParams.get('bookingId')
  const [bookDate, setBookDate] = useState(searchParams.get('bookDate') ?? '')
  const [duration, setDuration] = useState(Number(searchParams.get('duration') ?? 1))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<Step>('detail')
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)
  const [savedCards, setSavedCards] = useState<CreditCard[]>([])

  const handleBook = async (selectedDate: string, selectedDuration: number) => {
    const token = getToken()
    if (!token) { router.push(`/auth?returnTo=/booking/${id}`); return }
    if (!selectedDate) { setError('Please select a date'); return }
    setBookDate(selectedDate)
    setDuration(selectedDuration)
    setLoading(true)
    setError('')
    try {
      let booking: Booking
      if (bookingId) {
        booking = await updateBooking(token, bookingId, new Date(selectedDate).toISOString(), selectedDuration)
        router.push('/my-trips')
        return
      } else {
        booking = await createBooking(token, id, selectedDate, selectedDuration)
      }
      setCreatedBooking(booking)
      const cards = await getMyCards(token).catch(() => [])
      setSavedCards(cards)
      setStep('payment')
    } catch (e: unknown) {
      console.error('handleBook error:', e)
      setError(e instanceof Error ? e.message : 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'payment' && createdBooking) {
    return (
      <main style={{ minHeight: '100vh', padding: '2rem 1rem', background: '#f9fafb' }}>
        <button onClick={() => setStep('detail')} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.9rem' }}>
          ← Back
        </button>
        <PaymentStep
          booking={createdBooking}
          savedCards={savedCards}
          token={getToken() ?? ''}
          onPaid={(b) => { setCreatedBooking(b); setStep('done') }}
          onAddCard={async (data) => {
            const token = getToken()!
            const card = await addCard(token, data)
            setSavedCards(prev => [...prev, card])
            return card
          }}
          onPayWithCard={async (bookingId, cardId) => {
            const token = getToken()!
            return await payBooking(token, bookingId, cardId)
          }}
        />
      </main>
    )
  }

  if (step === 'done') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <h2 style={{ color: '#16a34a', fontSize: '1.5rem' }}>Booking Confirmed!</h2>
        <p style={{ color: '#6b7280' }}>Your payment was successful.</p>
        <button onClick={() => router.push('/my-trips')} style={{ padding: '0.6rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          View My Trips
        </button>
      </main>
    )
  }

  return (
    <main className={styles.wrapper} style={{ minHeight: '100vh' }}>
      {error && (
        <div style={{
          position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 999, maxWidth: '500px', width: '90%',
          padding: '0.75rem 1rem', background: '#fef2f2',
          border: '1px solid #fecaca', borderRadius: '8px',
          color: '#ef4444', fontSize: '0.85rem', textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {error}
          <button onClick={() => setError('')} style={{ marginLeft: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}
      <CampgroundDetailPage onBook={handleBook} bookingLoading={loading} />
    </main>
  )
}
