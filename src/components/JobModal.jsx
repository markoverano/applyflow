import { useState, useEffect } from 'react'
import { getEmptyJobForm, validateForm } from '../utils/helpers.js'

export function JobModal({ isOpen, jobToEdit, onClose, onSave }) {
  const [formData, setFormData] = useState(getEmptyJobForm())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData(jobToEdit ? { ...jobToEdit } : getEmptyJobForm())
      setErrors({})
    }
  }, [isOpen, jobToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length === 0) {
      onSave(formData)
      onClose()
    } else {
      setErrors(validationErrors)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{jobToEdit ? 'Edit Job' : 'Add New Job'}</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              maxLength="100"
              autoComplete="on"
            />
            {errors.jobTitle && <span className="error">{errors.jobTitle}</span>}
          </div>

          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              maxLength="100"
            />
            {errors.company && <span className="error">{errors.company}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength="200"
              rows="3"
            />
            <small>{(formData.description || '').length}/200</small>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Job Link</label>
            <input
              type="text"
              name="jobLink"
              value={formData.jobLink || ''}
              onChange={handleChange}
              placeholder="linkedin.com/jobs/view/..."
            />
            {errors.jobLink && <span className="error">{errors.jobLink}</span>}
          </div>

          <div className="form-group">
            <label>Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={formData.dateApplied || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
