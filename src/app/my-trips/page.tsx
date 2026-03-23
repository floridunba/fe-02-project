'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'
import { getMyBookings, deleteBooking } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Booking } from '@/types/camp'
import styles from './page.module.css'

export default function MyTripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <main className={styles.wrapper}>
      <Navbar showTrips={false} />
      <div className={styles.header}>
        <h1 className={styles.title}>My Trips</h1>
        <p className={styles.sub}>All your campground bookings</p>
      </div>
      <div className={styles.body}>
        {loading && <p style={{padding:'20px', color:'var(--muted)'}}>กำลังโหลด...</p>}
        {!loading && bookings.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏕️</div>
            <p className={styles.emptyText}>No bookings yet</p>
            <button className={styles.btnSm} onClick={() => router.push('/search')}>Explore camps</button>
          </div>
        )}
        {bookings.map(b => (
          <div key={b._id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.cardImg} style={{ background: 'linear-gradient(135deg,#4A5E4A,#3A4E3A)' }}>🏕️</div>
              <div className={styles.cardMeta}>
                <div className={styles.cardName}>{b.campground?.name}</div>
                <div className={styles.cardDates}>
                  {new Date(b.checkinDate).toLocaleDateString('th-TH')} – {new Date(b.checkoutDate).toLocaleDateString('th-TH')}
                </div>
                <StatusBadge status="confirmed" />
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.cardFooter}>
              <div className={styles.cardGuests}>📞 {b.campground?.tel || '-'}</div>
              <span className={styles.cardAction} onClick={() => handleDelete(b._id)}>Cancel ×</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}