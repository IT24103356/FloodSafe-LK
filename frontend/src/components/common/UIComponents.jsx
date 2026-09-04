import { AlertCircle, CheckCircle2, Inbox, LoaderCircle, RotateCcw, X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

export function PageHeader({ eyebrow, title, description, icon: Icon, actions, children }) {
  return (
    <header className="fs-page-header">
      <div className="fs-page-header-copy">
        {eyebrow && <span className="fs-eyebrow">{eyebrow}</span>}
        <div className="fs-title-row">
          {Icon && <span className="fs-title-icon"><Icon size={24} aria-hidden="true" /></span>}
          <h1>{title}</h1>
        </div>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="fs-page-actions">{actions}</div>}
      {children}
    </header>
  )
}

export function StatCard({ label, value, icon: Icon, tone = 'primary', detail }) {
  return (
    <article className={`fs-stat-card tone-${tone}`}>
      <span className="fs-stat-icon">{Icon && <Icon size={22} aria-hidden="true" />}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  )
}

export function StatusBadge({ children, tone = 'neutral', icon: Icon, className = '' }) {
  return (
    <span className={`fs-badge tone-${tone} ${className}`.trim()}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {children}
    </span>
  )
}

export function LoadingState({ label = 'Loading flood information…', cards = 3 }) {
  return (
    <div className="fs-loading" role="status" aria-live="polite">
      <span className="fs-loading-heading"><LoaderCircle size={20} aria-hidden="true" /> {label}</span>
      <div className="fs-skeleton-grid" aria-hidden="true">
        {Array.from({ length: cards }, (_, index) => <span key={index} className="fs-skeleton" />)}
      </div>
    </div>
  )
}

export function EmptyState({ title, message, action, icon: Icon = Inbox }) {
  return (
    <div className="fs-state fs-empty-state">
      <span className="fs-state-icon"><Icon size={30} aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Unable to load information', message, onRetry }) {
  return (
    <div className="fs-state fs-error-state" role="alert">
      <span className="fs-state-icon"><AlertCircle size={30} aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{message || 'Please try again in a moment.'}</p>
      {onRetry && (
        <button type="button" className="fs-button secondary" onClick={onRetry}>
          <RotateCcw size={16} aria-hidden="true" /> Retry
        </button>
      )}
    </div>
  )
}

export function Modal({ open, title, description, onClose, children, footer, size = 'medium' }) {
  const titleId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    requestAnimationFrame(() => dialogRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fs-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        ref={dialogRef}
        className={`fs-modal fs-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="fs-modal-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="fs-icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </header>
        <div className="fs-modal-body">{children}</div>
        {footer && <footer className="fs-modal-footer">{footer}</footer>}
      </section>
    </div>
  )
}

export function ConfirmModal({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onClose, busy = false, danger = true,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="small"
      footer={(
        <>
          <button type="button" className="fs-button secondary" onClick={onClose} disabled={busy}>{cancelLabel}</button>
          <button type="button" className={`fs-button ${danger ? 'danger' : 'primary'}`} onClick={onConfirm} disabled={busy}>
            {busy ? <LoaderCircle className="spin" size={16} /> : <CheckCircle2 size={16} />}
            {busy ? 'Please wait…' : confirmLabel}
          </button>
        </>
      )}
    >
      <p className="fs-confirm-message">{message}</p>
    </Modal>
  )
}
