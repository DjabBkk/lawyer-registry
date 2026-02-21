'use client'

import React, { useEffect, useState } from 'react'

import './index.scss'

type ExportScope = 'all' | 'search'

type ExportRow = {
  id: number
  name: string
  email: string
  claimURL: string
  listingTier: string
  verified: boolean
  claimTokenUsedAt: string | null
}

const escapeCsvValue = (value: string) => {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

const toCsv = (rows: ExportRow[]) => {
  const lines = [
    ['ID', 'Firm Name', 'Email', 'Claim URL', 'Listing Tier', 'Verified', 'Claimed']
      .map(escapeCsvValue)
      .join(','),
    ...rows.map((row) =>
      [
        String(row.id),
        row.name || '',
        row.email || '',
        row.claimURL || '',
        row.listingTier || '',
        row.verified ? 'Yes' : 'No',
        row.claimTokenUsedAt ? 'Yes' : 'No',
      ]
        .map(escapeCsvValue)
        .join(','),
    ),
  ]

  return `${lines.join('\n')}\n`
}

const downloadCsv = (content: string) => {
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = `businesses-claim-links-${date}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}

const BusinessesExportTool: React.FC = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [scope, setScope] = useState<ExportScope>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [search])

  const runExport = async (forcedSearch?: string) => {
    setError(null)
    setMessage(null)

    const effectiveSearch = (forcedSearch ?? debouncedSearch).trim()
    if (scope === 'search' && !effectiveSearch) {
      setError('Enter a firm name to export search results only.')
      return
    }

    setIsExporting(true)

    try {
      const params = new URLSearchParams()

      if (scope === 'search' && effectiveSearch) {
        params.set('search', effectiveSearch)
      }

      const query = params.toString()
      const response = await fetch(
        query
          ? `/api/businesses/export-claim-links?${query}`
          : '/api/businesses/export-claim-links',
      )

      const payload = (await response.json()) as
        | {
            rows?: ExportRow[]
            message?: string
          }
        | undefined

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to export claim links.')
      }

      const rows = Array.isArray(payload?.rows) ? payload.rows : []
      const csv = toCsv(rows)
      downloadCsv(csv)

      setMessage(`Exported ${rows.length} firms.`)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to export claim links.',
      )
    } finally {
      setIsExporting(false)
    }
  }

  const generateMissingTokens = async () => {
    setError(null)
    setMessage(null)
    setIsGenerating(true)

    try {
      const response = await fetch('/api/businesses/generate-missing-tokens', {
        method: 'POST',
      })

      const payload = (await response.json()) as
        | {
            generated?: number
            message?: string
          }
        | undefined

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to generate missing claim tokens.')
      }

      const generated = typeof payload?.generated === 'number' ? payload.generated : 0
      setMessage(`Generated ${generated} missing claim token${generated === 1 ? '' : 's'}.`)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to generate missing claim tokens.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="business-export-panel">
      <div className="business-export-panel__header">
        <h3>Export Claim Links</h3>
        <p>Download claim links for all firms or export a filtered list by firm name.</p>
      </div>

      <div className="business-export-panel__controls">
        <label className="business-export-panel__field">
          <span>Search by firm name</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void runExport(search)
              }
            }}
            placeholder="e.g. Bangkok Legal"
          />
        </label>

        <fieldset className="business-export-panel__scope">
          <legend>Export scope</legend>
          <label>
            <input
              type="radio"
              name="export-scope"
              value="all"
              checked={scope === 'all'}
              onChange={() => setScope('all')}
            />
            <span>All firms</span>
          </label>
          <label>
            <input
              type="radio"
              name="export-scope"
              value="search"
              checked={scope === 'search'}
              onChange={() => setScope('search')}
            />
            <span>Search results only</span>
          </label>
        </fieldset>
      </div>

      <div className="business-export-panel__actions">
        <button
          type="button"
          disabled={isExporting || isGenerating}
          onClick={() => void runExport()}
        >
          {isExporting ? 'Exporting…' : 'Export CSV'}
        </button>
        <button
          type="button"
          disabled={isExporting || isGenerating}
          onClick={() => void generateMissingTokens()}
        >
          {isGenerating ? 'Generating…' : 'Generate missing tokens'}
        </button>
      </div>

      {message ? <p className="business-export-panel__message">{message}</p> : null}
      {error ? <p className="business-export-panel__error">{error}</p> : null}
    </section>
  )
}

export default BusinessesExportTool
