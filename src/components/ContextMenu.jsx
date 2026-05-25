import { useEffect, useRef } from 'react'

export function ContextMenu({ x, y, job, onEdit, onDelete, onClose }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: y, left: x }}
    >
      <button
        className="context-menu-item"
        onClick={() => { onEdit(job); onClose() }}
      >
        Edit
      </button>
      <button
        className="context-menu-item context-menu-item--danger"
        onClick={() => { onDelete(job); onClose() }}
      >
        Delete
      </button>
    </div>
  )
}
