'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'
import { getMyBookings, deleteBooking, createReview } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Booking } from '@/types/camp'
import styles from './page.module.css'

interface ReviewModal {
  campgroundId: string
  bookingId: string
}

export default function MyTripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState<ReviewModal | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) { router.push('/auth'); return }
    getMyBookings(token)
      .then(setBookings)
      .finally(() => setLoading(false))
  }, [router])

  const handleDelete = async (id: string) => {
    const token = getToken()
    if (!token) return
    await deleteBooking(token, id)
    setBookings(prev => prev.filter(b => b._id !== id))
  }

  const getCheckout = (bookDate: string, duration: number) => {
    const date = new Date(bookDate)
    date.setDate(date.getDate() + duration)
    return date
  }

  const isCompleted = (bookDate: string, duration: number) => {
    return getCheckout(bookDate, duration) < new Date()
  }

  const handleOpenReview = (campgroundId: string, bookingId: string) => {
    setRating(5)
    setComment('')
    setReviewError('')
    setReviewModal({ campgroundId, bookingId })
  }

  const handleSubmitReview = async () => {
    if (!reviewModal) return
    const token = getToken()
    if (!token) return
    if (!comment.trim()) { setReviewError('กรุณาเขียน comment'); return }
    setSubmitting(true)
    try {
      await createReview(token, reviewModal.campgroundId, rating, comment)
      setReviewModal(null)
    } catch (e: unknown) {
      setReviewError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.wrapper}>
      <Navbar showTrips={false} />
      <div className={styles.header}>
        <h1 className={styles.title}>My Trips</h1>
        <p className={styles.sub}>All your campground bookings</p>
      </div>

      <div className={styles.body}>
        {loading && <p style={{ padding: '20px', color: 'var(--muted)' }}>กำลังโหลด...</p>}
        {!loading && bookings.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏕️</div>
            <p className={styles.emptyText}>No bookings yet</p>
            <button className={styles.btnSm} onClick={() => router.push('/search')}>Explore camps</button>
          </div>
        )}

        {bookings.map(b => {
          const completed = isCompleted(b.bookDate, b.duration)
          return (
            <div key={b._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardImg} style={{ background: 'linear-gradient(135deg,#4A5E4A,#3A4E3A)' }}>🏕️</div>
                <div className={styles.cardMeta}>
                  <div className={styles.cardName}>{b.campground?.name}</div>
                  <div className={styles.cardDates}>
                    {new Date(b.bookDate).toLocaleDateString('th-TH')} – {getCheckout(b.bookDate, b.duration).toLocaleDateString('th-TH')}
                    <span style={{ color: 'var(--muted)', fontSize: '12px', marginLeft: '6px' }}>[{b.duration} night(s)]</span>
                  </div>
                  <StatusBadge status={completed ? 'completed' : 'confirmed'} />
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.cardFooter}>
                <div className={styles.cardGuests}>📞 {b.campground?.tel || '-'}</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {completed ? (
                    <span
                      className={styles.cardAction}
                      onClick={() => handleOpenReview(b.campground?._id, b._id)}
                    >
                      ⭐ Rate
                    </span>
                  ) : (
                    <span
                      className={styles.cardAction}
                      onClick={() => router.push(`/booking/${b.campground?._id}?bookingId=${b._id}&bookDate=${b.bookDate}&duration=${b.duration}`)}
                    >
                      Edit ✎
                    </span>
                  )}
                  <span className={styles.cardAction} onClick={() => handleDelete(b._id)}>Cancel ×</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Rate your stay ⭐</h3>

            {/* Star selector */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  style={{ fontSize: '28px', cursor: 'pointer', opacity: s <= rating ? 1 : 0.25, transition: 'opacity 0.15s' }}
                >
                  ⭐
                </span>
              ))}
            </div>

            {/* Comment */}
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              style={{
                width: '100%', borderRadius: '10px', border: '1px solid #e0e0d8',
                padding: '10px 12px', fontSize: '14px', resize: 'none',
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
              }}
            />

            {reviewError && <p style={{ color: 'red', fontSize: '12px', margin: 0 }}>{reviewError}</p>}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setReviewModal(null)}
                style={{
                  padding: '8px 18px', borderRadius: '8px', border: '1px solid #ddd',
                  background: '#fff', cursor: 'pointer', fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                style={{
                  padding: '8px 18px', borderRadius: '8px', border: 'none',
                  background: 'var(--soil, #6B5240)', color: '#fff',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 600
                }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}