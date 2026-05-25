import { useState, useCallback } from 'react'
import { JobCard } from './JobCard.jsx'

// Shared across all Column instances — only one touch drag active at a time
let touchDragState = null

export function Column({ column, jobs, onJobUpdate, onJobDelete, onJobMove, onJobReorder, onContextMenu }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragOverInfo, setDragOverInfo] = useState(null)

  // Fires when dragging over the empty drop-zone area (not over a card)
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
    setDragOverInfo(null)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
      setDragOverInfo(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverInfo(null)
    const jobId = e.dataTransfer.getData('jobId')
    if (jobId) {
      onJobMove(jobId, column.id)
    }
  }

  const handleCardDragOver = (e, jobId) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(false)

    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    setDragOverInfo({ jobId, position })
  }

  const handleCardDrop = (e, targetJobId) => {
    e.preventDefault()
    e.stopPropagation()

    const draggedJobId = e.dataTransfer.getData('jobId')
    setDragOverInfo(null)
    setIsDragOver(false)

    if (!draggedJobId || draggedJobId === targetJobId) return

    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    onJobReorder(draggedJobId, targetJobId, position)
  }

  const handleCardTouchStart = useCallback((e, jobId) => {
    if (touchDragState) return
    const touch = e.touches[0]
    const cardWrapperEl = e.currentTarget
    const rect = cardWrapperEl.getBoundingClientRect()

    let activated = false
    let ghost = null
    let didDrag = false
    let dragTimer = null
    const handlers = {}

    function activate() {
      activated = true
      touchDragState = {
        jobId,
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      }

      const g = cardWrapperEl.cloneNode(true)
      Object.assign(g.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        pointerEvents: 'none',
        opacity: '0.85',
        zIndex: '9999',
        transform: 'rotate(2deg)',
        margin: '0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        transition: 'none',
      })
      document.body.appendChild(g)
      ghost = g
      cardWrapperEl.style.opacity = '0.3'
    }

    function cleanup() {
      clearTimeout(dragTimer)
      cardWrapperEl.style.opacity = ''
      document.removeEventListener('touchmove', handlers.move)
      document.removeEventListener('touchend', handlers.end)
    }

    handlers.move = function(e) {
      const t = e.touches[0]
      if (!activated) {
        // Cancel long-press if the finger moves too much (user is scrolling)
        if (Math.hypot(t.clientX - touch.clientX, t.clientY - touch.clientY) > 8) {
          cleanup()
        }
        return
      }
      e.preventDefault()
      didDrag = true
      ghost.style.left = `${t.clientX - touchDragState.offsetX}px`
      ghost.style.top = `${t.clientY - touchDragState.offsetY}px`
    }

    handlers.end = function(e) {
      if (activated && ghost && didDrag) {
        const t = e.changedTouches[0]
        ghost.style.display = 'none'
        const el = document.elementFromPoint(t.clientX, t.clientY)
        ghost.remove()
        ghost = null

        if (el) {
          const targetWrapper = el.closest('[data-job-id]')
          if (targetWrapper) {
            const targetJobId = targetWrapper.getAttribute('data-job-id')
            if (targetJobId && targetJobId !== jobId) {
              const wr = targetWrapper.getBoundingClientRect()
              const pos = t.clientY < wr.top + wr.height / 2 ? 'before' : 'after'
              onJobReorder(jobId, targetJobId, pos)
            }
          } else {
            const colEl = el.closest('[data-column-id]')
            if (colEl) {
              onJobMove(jobId, colEl.getAttribute('data-column-id'))
            }
          }
        }

        // Prevent the finger-lift from triggering the card's onClick (edit modal)
        const stopClick = (ce) => {
          ce.stopPropagation()
          ce.preventDefault()
          document.removeEventListener('click', stopClick, true)
        }
        document.addEventListener('click', stopClick, true)
      } else if (ghost) {
        ghost.remove()
        ghost = null
      }

      cleanup()
      touchDragState = null
    }

    dragTimer = setTimeout(activate, 200)
    document.addEventListener('touchmove', handlers.move, { passive: false })
    document.addEventListener('touchend', handlers.end)
  }, [onJobMove, onJobReorder])

  return (
    <div className={`column column-${column.id}`} data-column-id={column.id}>
      <div className="column-header">
        <h2>{column.title}</h2>
        <span className="job-count">{jobs.length}</span>
      </div>

      <div
        className={`drop-zone${isDragOver ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {jobs.length === 0 ? (
          <p className="empty-state">No jobs here yet</p>
        ) : (
          jobs.map(job => (
            <div
              key={job.id}
              className={`card-wrapper${dragOverInfo?.jobId === job.id ? ` insert-${dragOverInfo.position}` : ''}`}
              onDragOver={(e) => handleCardDragOver(e, job.id)}
              onDrop={(e) => handleCardDrop(e, job.id)}
              onTouchStart={(e) => handleCardTouchStart(e, job.id)}
              data-job-id={job.id}
            >
              <JobCard
                job={job}
                onUpdate={onJobUpdate}
                onDelete={onJobDelete}
                onContextMenu={onContextMenu}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
