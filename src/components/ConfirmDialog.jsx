export function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="btn-confirm">Delete</button>
          <button onClick={onCancel} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  )
}
