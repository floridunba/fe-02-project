'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getCamps } from '@/lib/api'
import { Camp } from '@/types/camp'
import styles from './page.module.css'

const FILTERS = ['All', 'North', 'South', 'East', 'West', 'Central']

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    getCamps()
      .then(setCamps)
      .finally(() => setLoading(false))
  }, [])

  const filtered = camps
    .filter(c => activeFilter === 'All' || c.region === activeFilter)
    .filter(c =>
      query === '' ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.province.toLowerCase().includes(query.toLowerCase()) ||
      c.district.toLowerCase().includes(query.toLowerCase())
    )

  return (
    <main className={styles.wrapper}>
      <Navbar showExplore={false} />
      <div className={styles.searchHeader}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search campsites, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/search?q=${query}`)}
          />
        </div>
        <div className={styles.filterRow}>
          {FILTERS.map(f => (
            <button key={f} className={`${styles.filterPill} ${activeFilter === f ? styles.on : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className={styles.sortRow}>
        <span className={styles.sortLabel}>
          {loading ? 'Loading...' : `${filtered.length} campsites found`}
        </span>
      </div>
      <div className={styles.results}>
        {loading && <p style={{padding:'20px', color:'var(--muted)'}}>กำลังโหลด...</p>}
        {filtered.map(camp => (
          <Link key={camp._id} href={`/booking/${camp._id}`} className={styles.resultCard}>
            <div className={styles.resultImg} style={{ background: 'linear-gradient(135deg,#4A5E4A,#3A4E3A)' }}>🏕️</div>
            <div className={styles.resultInfo}>
              <div className={styles.resultName}>{camp.name}</div>
              <div className={styles.resultLoc}>📍 {camp.district}, {camp.province}</div>
              <div className={styles.resultRow}>
                <div className={styles.resultPrice}>📞 {camp.tel || '-'}</div>
                <div className={styles.resultAvail}>⭐ {camp.averageRating.toFixed(1)}</div>
              </div>
              <div className={styles.tags}>
                <span className={styles.tag}>{camp.region}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}