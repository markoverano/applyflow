import LZString from 'lz-string'
import { getDefaultData } from './helpers.js'

const STORAGE_KEY = 'applyFlowData'

// Full key → abbreviated key
const JOB_KEYS = {
  jobTitle: 't',
  company: 'c',
  description: 'd',
  priority: 'p',
  columnId: 'col',
  interviewDate: 'iv',
  createdAt: 'ca',
  jobLink: 'jl',
  dateApplied: 'da',
}

// Abbreviated key → full key (derived)
const JOB_KEYS_EXPAND = Object.fromEntries(
  Object.entries(JOB_KEYS).map(([full, short]) => [short, full])
)

function abbreviateJob(job) {
  const out = { id: job.id }
  for (const [full, short] of Object.entries(JOB_KEYS)) {
    const val = job[full]
    if (val != null && val !== '') out[short] = val
  }
  return out
}

function expandJob(job) {
  const out = { id: job.id }
  for (const [short, full] of Object.entries(JOB_KEYS_EXPAND)) {
    if (job[short] != null) out[full] = job[short]
  }
  return out
}

export function saveToStorage({ jobs, columns }) {
  try {
    const payload = { j: jobs.map(abbreviateJob), cols: columns }
    const json = JSON.stringify(payload)
    const compressed = LZString.compressToBase64(json)
    localStorage.setItem(STORAGE_KEY, compressed)

    const rawKB = ((json.length * 2) / 1024).toFixed(2)
    const compKB = ((compressed.length) / 1024).toFixed(2)
    const pct = ((1 - compressed.length / json.length) * 100).toFixed(1)
    console.log(`Storage used: ${rawKB} KB → ${compKB} KB (${pct}% reduction)`)
  } catch (e) {
    console.error('Failed to save to storage:', e)
  }
}

export function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultData()

    // Try LZ-string decompression (current compressed format)
    const decompressed = LZString.decompressFromBase64(stored)
    if (decompressed) {
      const parsed = JSON.parse(decompressed)
      return {
        jobs: (parsed.j || []).map(expandJob),
        columns: parsed.cols?.length ? parsed.cols : getDefaultData().columns,
      }
    }

    // Auto-migration: old plain JSON format
    console.log('Migrating uncompressed storage data...')
    return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to load from storage:', e)
    return getDefaultData()
  }
}
