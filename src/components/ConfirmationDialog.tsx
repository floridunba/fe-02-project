'use client'

import { useState } from 'react'
import styles from './ConfirmationDialog.module.css'

interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => Promise<void> | void
  onCancel: () => void
  confirmLabel?: string
  danger?: boolean
}

/**
 * ConfirmationDialog — reusable modal for confirm/cancel flows.
 * Used in: US1-4 (edit card confirm), US1-7 (admin cancel payment confirm).
 */
export default function ConfirmationDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  danger = false
}: ConfirmationDialogProps) {
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <p className={styles.title} id="dialog-title">{title}</p>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className={`${styles.confirmBtn} ${danger ? styles.danger : styles.primary}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
