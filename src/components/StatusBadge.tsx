import styles from './StatusBadge.module.css'

type Status = 'confirmed' | 'pending' | 'completed' | 'cancelled'

const labelMap: Record<Status, string> = {
  confirmed: 'Confirmed', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled'
}

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{labelMap[status]}</span>
}