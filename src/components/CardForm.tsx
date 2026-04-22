'use client'

import { useState } from 'react'
import { CreditCard } from '@/types/camp'
import styles from './CardForm.module.css'

interface CardFormProps {
  mode: 'add' | 'edit'
  initialData?: Partial<CreditCard>
  onSubmit: (data: CardFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export interface CardFormData {
  cardholderName: string
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

function detectBrand(num: string): string {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'VISA'
  if (/^5[1-5]/.test(n)) return 'MC'
  if (/^3[47]/.test(n)) return 'AMEX'
  if (/^6(?:011|5)/.test(n)) return 'DISC'
  return ''
}

export default function CardForm({ mode, initialData, onSubmit, onCancel, loading }: CardFormProps) {
  const [cardholderName, setCardholderName] = useState(initialData?.cardholderName ?? '')
  const [cardNumber, setCardNumber] = useState('')
  const [maskedNumber, setMaskedNumber] = useState(
    initialData?.last4 ? `**** **** **** ${initialData.last4}` : ''
  )
  const [isMasked, setIsMasked] = useState(mode === 'edit' && !!initialData?.last4)
  const [expiryMonth, setExpiryMonth] = useState(String(initialData?.expiryMonth ?? ''))
  const [expiryYear, setExpiryYear] = useState(String(initialData?.expiryYear ?? ''))
  const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const brand = detectBrand(isMasked ? cardNumber : cardNumber)

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  function handleCardFocus() {
    if (isMasked) {
      setIsMasked(false)
      setMaskedNumber('')
    }
  }

  function handleCardBlur() {
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length > 0) {
      setIsMasked(true)
      setMaskedNumber(`**** **** **** ${digits.slice(-4)}`)
    } else if (mode === 'edit' && initialData?.last4) {
      setIsMasked(true)
      setMaskedNumber(`**** **** **** ${initialData.last4}`)
    }
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!cardholderName.trim()) errs.cardholderName = 'Required'
    if (mode === 'add') {
      const digits = cardNumber.replace(/\s/g, '')
      if (!/^\d{13,19}$/.test(digits)) errs.cardNumber = 'Invalid card number'
    }
    if (!expiryMonth || Number(expiryMonth) < 1 || Number(expiryMonth) > 12)
      errs.expiryMonth = 'Invalid month'
    if (!expiryYear || Number(expiryYear) < new Date().getFullYear())
      errs.expiryYear = 'Invalid year'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit({
        cardholderName,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryMonth: Number(expiryMonth),
        expiryYear: Number(expiryYear),
        isDefault
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Cardholder Name</label>
        <input
          className={`${styles.input} ${errors.cardholderName ? styles.error : ''}`}
          value={cardholderName}
          onChange={e => setCardholderName(e.target.value)}
          placeholder="Name on card"
        />
        {errors.cardholderName && <span className={styles.errorMsg}>{errors.cardholderName}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Card Number</label>
        <div className={styles.cardNumberWrapper}>
          <input
            className={`${styles.input} ${errors.cardNumber ? styles.error : ''}`}
            value={isMasked ? maskedNumber : cardNumber}
            onChange={e => {
              if (!isMasked) setCardNumber(formatCardNumber(e.target.value))
            }}
            onFocus={handleCardFocus}
            onBlur={handleCardBlur}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
          />
          {brand && <span className={styles.brandBadge}>{brand}</span>}
        </div>
        {errors.cardNumber && <span className={styles.errorMsg}>{errors.cardNumber}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Expiry Month</label>
          <input
            className={`${styles.input} ${errors.expiryMonth ? styles.error : ''}`}
            value={expiryMonth}
            onChange={e => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="MM"
            inputMode="numeric"
          />
          {errors.expiryMonth && <span className={styles.errorMsg}>{errors.expiryMonth}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Expiry Year</label>
          <input
            className={`${styles.input} ${errors.expiryYear ? styles.error : ''}`}
            value={expiryYear}
            onChange={e => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="YYYY"
            inputMode="numeric"
          />
          {errors.expiryYear && <span className={styles.errorMsg}>{errors.expiryYear}</span>}
        </div>
      </div>

      <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
        Set as default card
      </label>

      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={submitting || loading}>
          {submitting ? 'Saving…' : mode === 'add' ? 'Add Card' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
