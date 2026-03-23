import React from 'react'
import Link from 'next/link'
import styles from './ResultCard.module.css'

interface ResultCardProps {
  name: string
  loc: string
  price: number
  emoji: string
  gradient: string
  tags: string[]
  href?: string
}

export default function ResultCard({
  name, loc, price, emoji, gradient, tags, href = '/booking'
}: ResultCardProps) {
  return (
    <Link href={href} className={styles.resultCard}>
      <div className={styles.resultImg} style={{ background: gradient }}>
        {emoji}
      </div>
      <div className={styles.resultInfo}>
        <div className={styles.resultName}>{name}</div>
        <div className={styles.resultLoc}>📍 {loc}</div>
        <div className={styles.resultRow}>
          <div className={styles.resultPrice}>฿{price}<span>/night</span></div>
          <div className={styles.resultAvail}>✓ Available</div>
        </div>
        <div className={styles.tags}>
          {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>
    </Link>
  )
}