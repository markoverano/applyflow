import { useEffect } from 'react'

export function PrivacyModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal privacy-modal" onClick={e => e.stopPropagation()}>
        <div className="privacy-modal-header">
          <h2>Privacy Policy</h2>
          <button className="privacy-modal-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>
        <p className="privacy-updated">Last Updated: May 2026</p>

        <section className="privacy-section">
          <h3>The Short Version</h3>
          <p>We don't collect, store, or track anything about you. We literally can't see your data.</p>
        </section>

        <section className="privacy-section">
          <h3>What We Collect</h3>
          <p>Nothing.</p>
          <p>Your job applications, company names, interview dates, and all other data exist only on your computer, in your browser's localStorage. We never see it, store it, or transmit it.</p>
        </section>

        <section className="privacy-section">
          <h3>How It Works</h3>
          <ol>
            <li>You open applyflow.pages.dev in your browser</li>
            <li>Your browser stores your data locally (in localStorage)</li>
            <li>When you close the tab, the data stays on your computer</li>
            <li>We never receive, process, or store any of this data</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h3>What We CAN'T Do</h3>
          <ul className="privacy-cant-list">
            <li>&#x274C; See who you are</li>
            <li>&#x274C; Track which companies you applied to</li>
            <li>&#x274C; Know your job titles or search history</li>
            <li>&#x274C; Sell your data to recruiters</li>
            <li>&#x274C; Run analytics or advertisements</li>
            <li>&#x274C; Access your data after you close the browser</li>
            <li>&#x274C; Create a profile about you</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3>Cloudflare Pages (Hosting)</h3>
          <p>Your requests to load the app (HTML, CSS, JavaScript files) pass through Cloudflare Pages.</p>
          <p><strong>Cloudflare may collect:</strong></p>
          <ul>
            <li>Your IP address</li>
            <li>Browser type</li>
            <li>Page load times</li>
            <li>General traffic patterns</li>
          </ul>
          <p style={{ marginTop: '10px' }}><strong>Cloudflare does NOT:</strong></p>
          <ul>
            <li>Collect or see your job application data</li>
            <li>Create profiles about you</li>
            <li>Sell data about you to third parties</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3>Browser Storage</h3>
          <p>Your data is stored in browser localStorage, which:</p>
          <ul>
            <li>Persists even after closing the browser</li>
            <li>Survives computer restarts</li>
            <li>Remains until YOU manually clear your browser cache</li>
            <li>Is encrypted on your device if your computer is encrypted</li>
            <li>Is NOT encrypted at rest by default</li>
          </ul>
          <p className="privacy-note">Important: If someone gains physical access to your computer, they could potentially access your localStorage data. This is not unique to our app&mdash;it's a browser limitation.</p>
        </section>

        <section className="privacy-section">
          <h3>Third-Party Services</h3>
          <p>We don't use:</p>
          <ul>
            <li>Google Analytics</li>
            <li>Facebook Pixels</li>
            <li>Hotjar or heat mapping</li>
            <li>Segment or CDP platforms</li>
            <li>Any tracking pixels or cookies</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3>Data Deletion</h3>
          <p>To delete your data:</p>
          <ol>
            <li>Open DevTools (F12 or Cmd+Shift+I)</li>
            <li>Go to Application &rarr; Storage &rarr; localStorage</li>
            <li>Find <code>jobTrackerData</code> and delete it</li>
            <li>Or: Clear all browser data (Settings &rarr; Clear cache)</li>
          </ol>
          <p style={{ marginTop: '10px' }}>We have nothing to delete on our end&mdash;it only exists on your device.</p>
        </section>

        <section className="privacy-section">
          <h3>Changes to This Policy</h3>
          <p>If we ever add features that involve data collection, we'll:</p>
          <ul>
            <li>Clearly announce the change</li>
            <li>Give you the option to opt-out</li>
            <li>Update this policy</li>
          </ul>
          <p style={{ marginTop: '10px' }}>We will never add tracking or data collection without explicitly telling you.</p>
        </section>

        <section className="privacy-section">
          <h3>Questions?</h3>
          <p>Since we don't collect data, there's not much to ask. But you can:</p>
          <ul>
            <li>Inspect the source code on GitHub</li>
            <li>Check the browser network tab to see what's transmitted</li>
            <li>Run DevTools to verify no tracking scripts are loaded</li>
          </ul>
        </section>

        <div className="privacy-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
