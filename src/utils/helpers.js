import { COLUMNS } from './constants.js'

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function getEmptyJobForm() {
  return {
    jobTitle: '',
    company: '',
    description: '',
    priority: 'medium',
    jobLink: '',
    dateApplied: '',
    interviewDate: '',
    interviewDate2: '',
    interviewDate3: '',
    interviewDate4: '',
    interviewDate5: '',
    notes: '',
    columnId: 'todo'
  }
}

export function validateForm(formData) {
  const errors = {}

  if (!formData.jobTitle?.trim()) {
    errors.jobTitle = 'Job title is required'
  }

  if (!formData.company?.trim()) {
    errors.company = 'Company is required'
  }

  if (formData.description && formData.description.length > 200) {
    errors.description = 'Description max 200 characters'
  }

  return errors
}

export function getDefaultData() {
  return {
    jobs: [],
    columns: COLUMNS
  }
}

export function exportJobsToCSV(jobs, columns) {
  const columnMap = Object.fromEntries(columns.map(c => [c.id, c.title]))

  const escape = (val) => {
    const str = val == null ? '' : String(val)
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }

  const header = ['Job Title', 'Description', 'Apply Date', 'Interview 1', 'Interview 2', 'Interview 3', 'Interview 4', 'Interview 5', 'Link', 'Status', 'Notes']
  const rows = jobs.map(job => [
    escape(job.jobTitle),
    escape(job.description),
    escape(job.dateApplied),
    escape(job.interviewDate),
    escape(job.interviewDate2),
    escape(job.interviewDate3),
    escape(job.interviewDate4),
    escape(job.interviewDate5),
    escape(job.jobLink),
    escape(columnMap[job.columnId] || job.columnId),
    escape(job.notes)
  ])

  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'jobs.csv'
  a.click()
  URL.revokeObjectURL(url)
}
