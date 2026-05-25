import { useState } from 'react'
import { JobCard } from './JobCard.jsx'

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

  return (
    <div className={`column column-${column.id}`}>
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
