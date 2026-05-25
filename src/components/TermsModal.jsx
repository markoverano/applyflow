import { useEffect } from 'react'

export function TermsModal({ isOpen, onClose }) {
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
          <h2>Terms of Service</h2>
          <button className="privacy-modal-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>
        <p className="privacy-updated">Last Updated: May 2026</p>

        <section className="privacy-section">
          <h3>In Plain English</h3>
        </section>

        <section className="privacy-section">
          <h3>It's Free</h3>
          <p>Job Tracker is completely free. No hidden charges, no upgrade paywalls, no ads.</p>
        </section>

        <section className="privacy-section">
          <h3>It's Provided "As-Is"</h3>
          <p>We built this for ourselves and shared it. It might have bugs. We're not liable if something goes wrong.</p>
        </section>

        <section className="privacy-section">
          <h3>You Own Your Data</h3>
          <p>The data in your browser is yours. We don't own it, can't access it, and make no claims to it.</p>
        </section>

        <section className="privacy-section">
          <h3>Don't Do Illegal Stuff</h3>
          <p>Don't use Job Tracker to:</p>
          <ul>
            <li>Harass people</li>
            <li>Scrape our servers</li>
            <li>Spread malware</li>
            <li>Violate anyone's rights</li>
          </ul>
          <p style={{ marginTop: '10px' }}>(This applies to any app ever, but we're saying it anyway.)</p>
        </section>

        <section className="privacy-section">
          <h3>No Warranty</h3>
          <p>We don't guarantee the app will work 100% of the time. Browser updates, network issues, or other factors might break it. We'll fix things we can, but we're not responsible for data loss if your browser crashes.</p>
        </section>

        <section className="privacy-section">
          <h3>No Liability</h3>
          <p>We're not responsible if:</p>
          <ul>
            <li>You lose data because you cleared your cache</li>
            <li>Your browser deletes localStorage for any reason</li>
            <li>Your computer gets hacked and someone steals your data</li>
            <li>The app doesn't work as expected</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3>We Can Change Things</h3>
          <p>We might:</p>
          <ul>
            <li>Add new features</li>
            <li>Change the design</li>
            <li>Shut down the service (but we'll announce it)</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3>One More Thing</h3>
          <p>This is a side project, not a business. We're not a company. We're just engineers who built a tool and shared it.</p>
        </section>

        <section className="privacy-section">
          <h3>The Legal Version</h3>
          <p>THE APP IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.</p>
          <p style={{ marginTop: '10px' }}>IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE APP OR THE USE OR OTHER DEALINGS IN THE APP.</p>
        </section>

        <div className="privacy-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
