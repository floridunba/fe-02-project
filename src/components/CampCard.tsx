import Link from 'next/link'
import styles from './CampCard.module.css'

interface CampCardProps {
  name: string; location: string; rating: number
  reviewCount: number; tags: string[]; emoji: string; gradient: string; href?: string
}

export default function CampCard({ name, location, rating, reviewCount, tags, emoji, gradient, href = '/booking' }: CampCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.img} style={{ background: gradient }}>
        <span className={styles.emoji}>{emoji}</span>
        <div className={styles.overlay} />
        <div className={styles.badge}>⭐ {rating}</div>
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.loc}>📍 {location}</div>
        <div className={styles.tags}>{tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}</div>
        <div className={styles.row}>
          <div className={styles.rating}><strong>{rating}</strong> ({reviewCount} reviews)</div>
        </div>
      </div>
    </Link>
  )
}