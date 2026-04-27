'use client'

import { useState } from 'react'
import { CreditCard, Booking } from '@/types/camp'
import CardForm, { CardFormData } from './CardForm'
import CardListItem from './CardListItem'
import styles from './PaymentStep.module.css'

interface PaymentStepProps {
  booking: Booking
  savedCards: CreditCard[]
  token: string
  onPaid: (booking: Booking) => void
  onAddCard: (data: CardFormData) => Promise<CreditCard>
  onPayWithCard: (bookingId: string, cardId: string) => Promise<Booking>
}

export default function PaymentStep({
  booking,
  savedCards,
  token,
  onPaid,
  onAddCard,
  onPayWithCard
}: PaymentStepProps) {
  const [selectedCardId, setSelectedCardId] = useState<string>(
    savedCards.find(c => c.isDefault)?._id ?? savedCards[0]?._id ?? ''
  )
  const [showAddForm, setShowAddForm] = useState(savedCards.length === 0)
  const [cards, setCards] = useState<CreditCard[]>(savedCards)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [paid, setPaid] = useState(false)

  async function handleAddCard(data: CardFormData) {
    const newCard = await onAddCard(data)
    setCards(prev => [...prev, newCard])
    setSelectedCardId(newCard._id)
    setShowAddForm(false)
  }

  async function handlePay() {
    if (!selectedCardId) { setError('Please select a card'); return }
    setPaying(true)
    setError('')
    try {
      const updated = await onPayWithCard(booking._id, selectedCardId)
      setPaid(true)
      onPaid(updated)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  if (paid) {
    return (
      <div className={styles.container}>
        <div className={styles.successMsg}>
          Payment successful! Your booking is confirmed.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.heading}>Complete Payment</p>
      <p className={styles.subheading}>
        Booking ID: {booking._id.slice(-8).toUpperCase()}
      </p>

      {showAddForm ? (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Add New Card</p>
          <CardForm
            mode="add"
            onSubmit={handleAddCard}
            onCancel={() => cards.length > 0 && setShowAddForm(false)}
          />
        </div>
      ) : (
        <>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Select Card</p>
            {cards.map(card => (
              <div key={card._id} style={{ marginBottom: '0.5rem' }}>
                <CardListItem
                  card={card}
                  selected={selectedCardId === card._id}
                  onSelect={c => setSelectedCardId(c._id)}
                />
              </div>
            ))}
          </div>

          <button className={styles.addNewBtn} onClick={() => setShowAddForm(true)}>
            + Add New Card
          </button>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button className={styles.payBtn} onClick={handlePay} disabled={paying || !selectedCardId}>
            {paying ? 'Processing…' : 'Pay Now'}
          </button>
        </>
      )}
    </div>
  )
}
