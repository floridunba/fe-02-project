import Link from 'next/link'
import styles from './CampCard.module.css'

interface CampCardProps {
  href: string
  name: string
  location: string
  rating: number
  reviewCount?: number
  price?: number
  tags?: string[]
  imgSrc?: string
}

export default function CampCard({
  href, name, location, rating, reviewCount, price, tags = [], imgSrc}: CampCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.img}>
        {imgSrc ? (
          <img src={imgSrc} alt={name} className={styles.photo} />
        ) : (
          <div className={styles.placeholder}>🏕️</div>
        )}
        <div className={styles.ratingBadge}>⭐ {rating.toFixed(1)}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{name}</div>
        <div className={styles.location}>📍 {location}</div>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.footer}>
          {price != null && (
            <div className={styles.price}>
              <span className={styles.priceNum}>{price.toLocaleString()}</span>
              <span className={styles.priceUnit}> / night</span>
            </div>
          )}
          {reviewCount != null && (
            <div className={styles.reviews}>
              {rating.toFixed(1)} ({reviewCount} reviews)
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}