import { Column } from './Column.jsx'

export function JobBoard({ jobs, columns, onUpdateJob, onDeleteJob, onOpenModal, onMoveJob, onReorderJob, onContextMenu, onExportCSV, onOpenPrivacy, onOpenTerms, isDark, onToggleTheme }) {
  return (
    <div className="job-board">
      <header className="board-header">
        <div className="board-title">
          <h1>ApplyFlow</h1>
          <span className="board-tagline">100% browser-based. Zero servers. Zero data collection.</span>
        </div>
        <div className="header-actions">
          <button className="btn-theme" onClick={onToggleTheme} aria-label="Toggle theme">
            {isDark ? '☀' : '☾'}
          </button>
          <button className="btn-export" onClick={onExportCSV} disabled={jobs.length === 0}>
            Export CSV
          </button>
          <button className="btn-add" onClick={() => onOpenModal(null)}>
            + Add Job
          </button>
        </div>
      </header>

      <div className="columns-container">
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            jobs={jobs.filter(j => j.columnId === column.id)}
            onJobUpdate={onUpdateJob}
            onJobDelete={onDeleteJob}
            onJobMove={onMoveJob}
            onJobReorder={onReorderJob}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>

      <footer className="board-footer">
        <p className="footer-tagline">Your job search, your privacy.</p>
        <nav className="footer-links">
          <a href="#" onClick={e => { e.preventDefault(); onOpenPrivacy() }}>Privacy</a>
          <span>|</span>
          <a href="#" onClick={e => { e.preventDefault(); onOpenTerms() }}>Terms</a>
          <span>|</span>
          <a href="https://github.com/markoverano/applyflow" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </footer>
    </div>
  )
}
