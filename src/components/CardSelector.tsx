'use client'

import { CreditCard } from '@/types/camp'
import CardListItem from './CardListItem'
import styles from './CardSelector.module.css'

interface CardSelectorProps {
  cards: CreditCard[]
  selectedId: string
  onSelect: (card: CreditCard) => void
  onEdit?: (card: CreditCard) => void
  onDelete?: (card: CreditCard) => void
}

/**
 * CardSelector — renders a list of CardListItem with radio-style selection.
 * Used in payment flow and card management page.
 */
export default function CardSelector({ cards, selectedId, onSelect, onEdit, onDelete }: CardSelectorProps) {
  if (cards.length === 0) {
    return <p className={styles.empty}>No saved cards. Add one below.</p>
  }

  return (
    <div className={styles.wrapper}>
      {cards.map(card => (
        <CardListItem
          key={card._id}
          card={card}
          selected={selectedId === card._id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
