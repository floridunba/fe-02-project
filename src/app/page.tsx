'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CampCard from '@/components/CampCard'
import { getCamps } from '@/lib/api'
import { Camp } from '@/types/camp'
import styles from './page.module.css'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [camps, setCamps] = useState<Camp[]>([])
  const router = useRouter()

  useEffect(() => {
    getCamps().then(data => setCamps(data.slice(0, 4)))
  }, [])

  return (
    <main className={styles.wrapper}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroTexture} />
        <p className={styles.heroTag}>Your next escape awaits</p>
        <h1 className={styles.heroTitle}>Find your stay<br />in nature.</h1>
        <p className={styles.heroDesc}>
          Discover handpicked campgrounds,<br />compare amenities, and book with ease.
        </p>
        <div className={styles.heroSearch}>
          <input
            type="text"
            placeholder="Where do you want to camp?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/search?q=${query}`)}
          />
          <button onClick={() => router.push(`/search?q=${query}`)}>Search</button>
        </div>
      </section>
      <section className={styles.grid}>
        <h2 className={styles.sectionTitle}>Popular spots</h2>
        <p className={styles.sectionSub}>Highly rated by campers this season</p>
        {camps.map((camp, i) => (
          <CampCard
            key={camp._id}
            href={`/booking/${camp._id}`}
            name={camp.name}
            location={`${camp.district}, ${camp.province}`}
            rating={camp.averageRating}
            reviewCount={camp.totalReviews}
            tags={[camp.region]}
            emoji={['🌲','🏕️','⛺','🌄'][i % 4]}
            gradient={[
              'linear-gradient(135deg,#4A5E4A,#3A4E3A)',
              'linear-gradient(135deg,#6B5240,#A08060)',
              'linear-gradient(135deg,#3A4E6B,#6080A0)',
              'linear-gradient(135deg,#5A4A6B,#8060A0)',
            ][i % 4]}
          />
        ))}
      </section>
    </main>
  )
}