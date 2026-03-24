'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'
import { isLoggedIn, getToken, removeToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { getMe } from '@/lib/api'

interface NavbarProps {
  showExplore?: boolean
  showTrips?: boolean
  showSignIn?: boolean
}

export default function Navbar({ showExplore = true, showTrips = true, showSignIn = true }: NavbarProps) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
  if (isLoggedIn()) {
    const token = getToken()
    if (token) {
      setLoggedIn(true)
      getMe(token)
        .then(user => setUsername(user.name))
        .catch(() => setUsername('User'))
    }
  }
}, [])

  const handleLogout = () => {
    removeToken()
    setLoggedIn(false)
    setUsername(null)
    router.push('/')
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>camp<span>.</span>io</Link>
      <div className={styles.links}>
        {showExplore && <Link href="/search" className={styles.link}>Explore</Link>}
        {showTrips && <Link href="/my-trips" className={styles.link}>Trips</Link>}
        {showSignIn && (
          loggedIn ? (
            <>
              <span className={styles.username}>{username}</span>
              <button onClick={handleLogout} className={styles.btn}>Logout</button>
            </>
          ) : (
            <Link href="/auth" className={styles.btn}>Sign in</Link>
          )
        )}
      </div>
    </nav>
  )
}