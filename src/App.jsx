import { useState, useCallback, useEffect } from 'react'
import { JobBoard } from './components/JobBoard.jsx'
import { JobModal } from './components/JobModal.jsx'
import { ConfirmDialog } from './components/ConfirmDialog.jsx'
import { ContextMenu } from './components/ContextMenu.jsx'
import { PrivacyModal } from './components/PrivacyModal.jsx'
import { TermsModal } from './components/TermsModal.jsx'
import { generateUUID, exportJobsToCSV } from './utils/helpers.js'
import { saveToStorage, loadFromStorage } from './utils/storage.js'
import './styles/App.css'
import './styles/JobBoard.css'
import './styles/Column.css'
import './styles/JobCard.css'
import './styles/Modal.css'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [columns, setColumns] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const data = loadFromStorage()
    setJobs(data.jobs)
    setColumns(data.columns)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    saveToStorage({ jobs, columns })
  }, [isLoaded, jobs, columns])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('applyFlowTheme') === 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('applyFlowTheme', isDark ? 'dark' : 'light')
  }, [isDark])

  const addJob = useCallback((jobData) => {
    setJobs(prev => [
      ...prev,
      { id: generateUUID(), ...jobData, createdAt: new Date().toISOString() }
    ])
  }, [])

  const updateJob = useCallback((jobId, updates) => {
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, ...updates } : job))
  }, [])

  const deleteJob = useCallback((jobId) => {
    setJobs(prev => prev.filter(job => job.id !== jobId))
  }, [])

  const moveJob = useCallback((jobId, newColumnId) => {
    updateJob(jobId, { columnId: newColumnId })
  }, [updateJob])

  const reorderJob = useCallback((draggedJobId, targetJobId, position) => {
    setJobs(prev => {
      const list = [...prev]
      const fromIndex = list.findIndex(j => j.id === draggedJobId)
      if (fromIndex === -1) return prev

      const [dragged] = list.splice(fromIndex, 1)

      const targetIndex = list.findIndex(j => j.id === targetJobId)
      if (targetIndex === -1) return prev

      dragged.columnId = list[targetIndex].columnId
      list.splice(position === 'before' ? targetIndex : targetIndex + 1, 0, dragged)
      return list
    })
  }, [])

  const handleOpenModal = useCallback((job) => {
    setEditingJob(job || null)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingJob(null)
  }, [])

  const handleSaveJob = useCallback((formData) => {
    if (editingJob) {
      updateJob(editingJob.id, formData)
    } else {
      addJob(formData)
    }
  }, [editingJob, updateJob, addJob])

  const handleDeleteRequest = useCallback((job) => {
    setDeleteConfirm(job)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm) {
      deleteJob(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }, [deleteConfirm, deleteJob])

  const handleContextMenu = useCallback((e, job) => {
    setContextMenu({ x: e.clientX, y: e.clientY, job })
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  return (
    <>
      <JobBoard
        jobs={jobs}
        columns={columns}
        onUpdateJob={handleOpenModal}
        onDeleteJob={handleDeleteRequest}
        onOpenModal={handleOpenModal}
        onMoveJob={moveJob}
        onReorderJob={reorderJob}
        onContextMenu={handleContextMenu}
        onExportCSV={() => exportJobsToCSV(jobs, columns)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(d => !d)}
      />

      <JobModal
        isOpen={modalOpen}
        jobToEdit={editingJob}
        onClose={handleCloseModal}
        onSave={handleSaveJob}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        message={deleteConfirm ? `Delete "${deleteConfirm.jobTitle}" at ${deleteConfirm.company}?` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          job={contextMenu.job}
          onEdit={handleOpenModal}
          onDelete={handleDeleteRequest}
          onClose={handleCloseContextMenu}
        />
      )}
    </>
  )
}
