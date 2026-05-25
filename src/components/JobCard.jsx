import { useState } from 'react'

export function JobCard({ job, onUpdate, onDelete, onContextMenu }) {
  const [isDragging, setIsDragging] = useState(false)

  const daysElapsed = job.interviewDate
    ? Math.floor((Date.now() - new Date(job.interviewDate)) / (1000 * 60 * 60 * 24))
    : null

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('jobId', job.id)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!isDragging) {
      onUpdate(job)
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    onContextMenu(e, job)
  }

  const priorityClass = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
  }[job.priority] || ''

  return (
    <div
      className={`job-card ${priorityClass}${isDragging ? ' dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <div className="card-header">
        <h3>{job.jobTitle}</h3>
        <span className={`priority-badge ${job.priority}`}>
          {job.priority}
        </span>
      </div>

      <p className="company-name">{job.company}</p>

      {job.description && (
        <p className="description">{job.description}</p>
      )}

      <div className="card-meta">
        {job.dateApplied && (
          <p className="meta-item">Applied {new Date(job.dateApplied).toLocaleDateString()}</p>
        )}
        {daysElapsed !== null && (
          <p className="meta-item">Interview: {daysElapsed} day{daysElapsed !== 1 ? 's' : ''} ago</p>
        )}
      </div>

      {job.jobLink && (
        <a
          className="job-link"
          href={/^https?:\/\//i.test(job.jobLink) ? job.jobLink : `https://${job.jobLink}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          View posting
        </a>
      )}

      <button
        className="btn-delete"
        onClick={(e) => { e.stopPropagation(); onDelete(job) }}
        title="Delete"
        aria-label="Delete job"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  )
}
