'use client'
import Link from 'next/link'
import styles from './Navbar.module.css'

interface NavbarProps {
  showExplore?: boolean
  showTrips?: boolean
  showSignIn?: boolean
}

export default function Navbar({ showExplore = true, showTrips = true, showSignIn = true }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>camp<span>.</span>io</Link>
      <div className={styles.links}>
        {showExplore && <Link href="/search" className={styles.link}>Explore</Link>}
        {showTrips && <Link href="/my-trips" className={styles.link}>Trips</Link>}
        {showSignIn && <Link href="/auth" className={styles.btn}>Sign in</Link>}
      </div>
    </nav>
  )
}