'use client'

import { CreditCard } from '@/types/camp'
import styles from './CardListItem.module.css'

interface CardListItemProps {
  card: CreditCard
  selected?: boolean
  onSelect?: (card: CreditCard) => void
  onEdit?: (card: CreditCard) => void
  onDelete?: (card: CreditCard) => void
}

const BRAND_LABELS: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
  other: 'CARD'
}

const BRAND_CLASSES: Record<string, string> = {
  visa: styles.brandVisa,
  mastercard: styles.brandMc,
  amex: styles.brandAmex,
  discover: styles.brandDisc,
  other: styles.brandOther
}

export default function CardListItem({ card, selected, onSelect, onEdit, onDelete }: CardListItemProps) {
  const brandLabel = BRAND_LABELS[card.brand] ?? 'CARD'
  const brandClass = BRAND_CLASSES[card.brand] ?? styles.brandOther

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect?.(card)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && onSelect?.(card)}
    >
      {onSelect && (
        <input
          type="radio"
          className={styles.radio}
          checked={!!selected}
          onChange={() => onSelect(card)}
          onClick={e => e.stopPropagation()}
          aria-label={`Select card ending in ${card.last4}`}
        />
      )}

      <div className={`${styles.brandIcon} ${brandClass}`}>
        {brandLabel}
      </div>

      <div className={styles.info}>
        <div className={styles.cardNumber}>
          •••• •••• •••• {card.last4}
          {card.isDefault && <span className={styles.defaultBadge}>Default</span>}
        </div>
        <div className={styles.meta}>
          {card.cardholderName} &nbsp;·&nbsp; Expires {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className={styles.actions} onClick={e => e.stopPropagation()}>
          {onEdit && (
            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => onEdit(card)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(card)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
