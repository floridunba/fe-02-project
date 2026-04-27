'use client'

import { useState, useEffect } from 'react'
import styles from './CountdownTimer.module.css'

interface CountdownTimerProps {
  /** ISO date string from backend (booking.paymentExpiresAt) */
  expiresAt: string
  onExpired?: () => void
}

function getRemaining(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return null
  const totalSeconds = Math.floor(diff / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return { h, m, s, totalMs: diff }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/**
 * CountdownTimer — counts down to expiresAt (read from BE, never client-generated).
 * Turns orange when < 2 hours remaining, red when < 1 hour.
 * Returns null (renders nothing) when expired.
 */
export default function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => getRemaining(expiresAt))

  useEffect(() => {
    const interval = setInterval(() => {
      const r = getRemaining(expiresAt)
      setRemaining(r)
      if (!r) {
        clearInterval(interval)
        onExpired?.()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  if (!remaining) {
    return <span className={styles.expired}>Payment window expired</span>
  }

  const urgencyClass =
    remaining.totalMs < 60 * 60 * 1000
      ? styles.urgent      // < 1 hour: red
      : remaining.totalMs < 2 * 60 * 60 * 1000
      ? styles.warning     // < 2 hours: orange
      : ''

  return (
    <span className={`${styles.wrapper} ${urgencyClass}`}>
      <span className={styles.icon}>⏱</span>
      <span className={styles.time}>
        {pad(remaining.h)}:{pad(remaining.m)}:{pad(remaining.s)}
      </span>
      <span className={styles.label}>remaining</span>
    </span>
  )
}
