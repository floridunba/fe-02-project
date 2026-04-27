import styles from './StatusBadge.module.css'

type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'expired'

const labelMap: Record<PaymentStatus, string> = {
  pending: 'Payment Pending',
  paid: 'Paid',
  cancelled: 'Cancelled',
  expired: 'Expired'
}

const colorMap: Record<PaymentStatus, React.CSSProperties> = {
  pending: { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' },
  paid: { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' },
  cancelled: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },
  expired: { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }
}

import React from 'react'

/**
 * PaymentStatusBadge — shows payment status with appropriate color.
 * Handles: pending | paid | cancelled | expired
 */
export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const style = colorMap[status]
  return (
    <span style={{
      ...style,
      padding: '0.2rem 0.6rem',
      borderRadius: '99px',
      fontSize: '0.75rem',
      fontWeight: 700,
      display: 'inline-block'
    }}>
      {labelMap[status]}
    </span>
  )
}
