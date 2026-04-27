'use client'

import { useState } from 'react'
import { CreditCard } from '@/types/camp'
import CardListItem from './CardListItem'
import CardForm, { CardFormData } from './CardForm'
import styles from './CardManager.module.css'

interface CardManagerProps {
  cards: CreditCard[]
  onAdd: (data: CardFormData) => Promise<void>
  onEdit: (cardId: string, data: CardFormData) => Promise<void>
  onDelete: (cardId: string) => Promise<void>
}

/**
 * CardManager — full card management UI: list, add, edit, delete.
 * Used in profile/settings and as standalone card management section.
 */
export default function CardManager({ cards, onAdd, onEdit, onDelete }: CardManagerProps) {
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(data: CardFormData) {
    setError('')
    try {
      await onAdd(data)
      setShowAddForm(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add card')
    }
  }

  async function handleEdit(data: CardFormData) {
    if (!editingCard) return
    setError('')
    try {
      await onEdit(editingCard._id, data)
      setEditingCard(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update card')
    }
  }

  async function handleDelete(card: CreditCard) {
    setError('')
    try {
      await onDelete(card._id)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete card')
    }
  }

  return (
    <div className={styles.container}>
      <p className={styles.heading}>My Cards</p>

      {/* Card list with edit/delete actions */}
      <div className={styles.cardList}>
        {cards.map(card => (
          <div key={card._id}>
            <CardListItem
              card={card}
              onEdit={c => { setEditingCard(c); setShowAddForm(false) }}
              onDelete={handleDelete}
            />
            {/* Inline edit form */}
            {editingCard?._id === card._id && (
              <div className={styles.editOverlay}>
                <p className={styles.overlayTitle}>Edit Card</p>
                <CardForm
                  mode="edit"
                  initialData={editingCard}
                  onSubmit={handleEdit}
                  onCancel={() => setEditingCard(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add card section */}
      <div className={styles.addSection}>
        {showAddForm ? (
          <div className={styles.editOverlay}>
            <p className={styles.overlayTitle}>Add New Card</p>
            <CardForm
              mode="add"
              onSubmit={handleAdd}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : (
          <button className={styles.addToggleBtn} onClick={() => { setShowAddForm(true); setEditingCard(null) }}>
            + Add New Card
          </button>
        )}
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  )
}
