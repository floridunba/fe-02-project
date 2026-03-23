'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCampById, createBooking } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Camp } from '@/types/camp'
import styles from '../page.module.css'

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [camp, setCamp] = useState<Camp | null>(null)
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCampById(id).then(setCamp)
  }, [id])

  const handleBook = async () => {
    const token = getToken()
    if (!token) { router.push('/auth'); return }
    if (!checkin || !checkout) { setError('กรุณาเลือกวันที่'); return }
    setLoading(true)
    try {
      await createBooking(token, id, checkin, checkout)
      router.push('/my-trips')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  if (!camp) return <div style={{padding:'40px', textAlign:'center'}}>Loading...</div>

  return (
    <main className={styles.wrapper}>
      <div className={styles.hero}>
        <button className={styles.backBtn} onClick={() => router.push('/search')}>← Back</button>
        <span className={styles.heroEmoji}>🏕️</span>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInfo}>
          <div className={styles.heroName}>{camp.name}</div>
          <div className={styles.heroLoc}>📍 {camp.district}, {camp.province} · ⭐ {camp.averageRating.toFixed(1)}</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select dates</div>
          <div className={styles.dateRow}>
            <div className={styles.dateBox}>
              <div className={styles.dateLabel}>Check-in</div>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)}
                style={{border:'none', background:'transparent', fontSize:'13px', fontWeight:500, color:'var(--soil)', outline:'none', width:'100%'}} />
            </div>
            <div className={styles.dateBox}>
              <div className={styles.dateLabel}>Check-out</div>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)}
                style={{border:'none', background:'transparent', fontSize:'13px', fontWeight:500, color:'var(--soil)', outline:'none', width:'100%'}} />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Campground info</div>
          <div className={styles.amenityGrid}>
            <div className={styles.amenityItem}><span>📍</span>{camp.address}</div>
            <div className={styles.amenityItem}><span>📞</span>{camp.tel || '-'}</div>
            <div className={styles.amenityItem}><span>🗺️</span>{camp.region}</div>
            <div className={styles.amenityItem}><span>📮</span>{camp.postalcode}</div>
          </div>
        </div>
        {error && <p style={{color:'red', fontSize:'12px', marginBottom:'10px'}}>{error}</p>}
        <button className={styles.bookBtn} onClick={handleBook} disabled={loading}>
          {loading ? 'Booking...' : 'Confirm booking →'}
        </button>
      </div>
    </main>
  )
}