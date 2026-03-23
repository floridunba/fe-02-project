'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function BookingPage() {
  const [guests, setGuests] = useState(2)
  const router = useRouter()
  const pricePerNight = 850, nights = 2, serviceFee = 85
  const total = pricePerNight * nights + serviceFee
  const changeGuest = (d: number) => setGuests(p => Math.max(1, Math.min(10, p + d)))

  return (
    <main className={styles.wrapper}>
      <div className={styles.hero}>
        <button className={styles.backBtn} onClick={() => router.push('/search')}>← Back</button>
        <span className={styles.heroEmoji}>🌲</span>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInfo}>
          <div className={styles.heroName}>Pine Ridge Campground</div>
          <div className={styles.heroLoc}>📍 Chiang Mai, Thailand &nbsp;·&nbsp; ⭐ 4.9</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select dates</div>
          <div className={styles.dateRow}>
            <div className={styles.dateBox}><div className={styles.dateLabel}>Check-in</div><div className={styles.dateVal}>Fri, 4 Apr</div></div>
            <div className={styles.dateBox}><div className={styles.dateLabel}>Check-out</div><div className={styles.dateVal}>Sun, 6 Apr</div></div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Guests</div>
          <div className={styles.guestCtrl}>
            <div className={styles.guestInfo}>
              <div className={styles.guestLabel}>Number of guests</div>
              <div className={styles.guestNum}>{guests} {guests === 1 ? 'guest' : 'guests'}</div>
            </div>
            <div className={styles.guestBtns}>
              <button className={styles.guestBtn} onClick={() => changeGuest(-1)}>−</button>
              <button className={styles.guestBtn} onClick={() => changeGuest(1)}>+</button>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Amenities included</div>
          <div className={styles.amenityGrid}>
            {[{icon:'🔥',label:'Campfire pit'},{icon:'🚿',label:'Shower facility'},{icon:'🅿️',label:'Free parking'},{icon:'🐕',label:'Pet-friendly'}].map(a => (
              <div key={a.label} className={styles.amenityItem}><span className={styles.amenityIcon}>{a.icon}</span>{a.label}</div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Price summary</div>
          <div className={styles.priceSummary}>
            <div className={styles.priceRow}><span>฿{pricePerNight} × {nights} nights</span><span>฿{(pricePerNight*nights).toLocaleString()}</span></div>
            <div className={styles.priceRow}><span>Service fee</span><span>฿{serviceFee}</span></div>
            <div className={`${styles.priceRow} ${styles.total}`}><span>Total</span><span>฿{total.toLocaleString()}</span></div>
          </div>
          <button className={styles.bookBtn} onClick={() => router.push('/my-trips')}>Confirm booking →</button>
        </div>
      </div>
    </main>
  )
}