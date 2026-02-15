'use client'

import React, { useCallback, useEffect, useState } from 'react'

import './index.scss'

type SeedCounts = {
  practiceAreas: number
  locations: number
  lawFirms: number
}

type SeedStatus = {
  seeded: boolean
  counts: SeedCounts
}

const emptyCounts: SeedCounts = {
  practiceAreas: 0,
  locations: 0,
  lawFirms: 0,
}

const SeedButton: React.FC = () => {
  const [status, setStatus] = useState<SeedStatus>({ seeded: false, counts: emptyCounts })
  const [loading, setLoading] = useState<'seed' | 'clear' | 'reseed' | 'status' | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    setLoading('status')
    setMessage(null)

    try {
      const response = await fetch('/api/seed', { method: 'GET' })
      if (!response.ok) {
        throw new Error('Unable to load seed status.')
      }

      const data = (await response.json()) as SeedStatus
      setStatus(data)
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Unable to load seed status.'
      setMessage(err)
    } finally {
      setLoading((current) => (current === 'status' ? null : current))
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  const handleSeed = async () => {
    setLoading('seed')
    setMessage(null)

    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to seed database.')
      }

      setMessage('Seed completed successfully.')
      await loadStatus()
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Failed to seed database.'
      setMessage(err)
    } finally {
      setLoading(null)
    }
  }

  const handleClear = async () => {
    if (!window.confirm('This will remove all law firm, location, and practice area data. Continue?')) {
      return
    }

    setLoading('clear')
    setMessage(null)

    try {
      const response = await fetch('/api/seed/clear', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to clear database.')
      }

      setMessage('Seed data cleared.')
      await loadStatus()
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Failed to clear database.'
      setMessage(err)
    } finally {
      setLoading(null)
    }
  }

  const handleReseed = async () => {
    if (!window.confirm('This will clear and re-seed all law firm data. Continue?')) {
      return
    }

    setLoading('reseed')
    setMessage(null)

    try {
      const clearResponse = await fetch('/api/seed/clear', { method: 'POST' })
      if (!clearResponse.ok) {
        const data = await clearResponse.json()
        throw new Error(data?.error || 'Failed to clear database.')
      }

      const seedResponse = await fetch('/api/seed', { method: 'POST' })
      if (!seedResponse.ok) {
        const data = await seedResponse.json()
        throw new Error(data?.error || 'Failed to seed database.')
      }

      setMessage('Re-seed completed successfully.')
      await loadStatus()
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Failed to re-seed database.'
      setMessage(err)
    } finally {
      setLoading(null)
    }
  }

  const isBusy = loading !== null

  return (
    <div className="seed-panel">
      <h4>Seed Database</h4>
      <p>
        {status.seeded ? 'Database contains seed data.' : 'Database is empty.'} Count:{' '}
        {status.counts.lawFirms} Law Firms, {status.counts.practiceAreas} Practice Areas,{' '}
        {status.counts.locations} Locations.
      </p>
      <div className="seed-panel__actions">
        <button className="seedButton" disabled={isBusy} onClick={handleSeed} type="button">
          Seed Database
        </button>
        <button className="seedButton" disabled={isBusy} onClick={handleClear} type="button">
          Clear Database
        </button>
        <button className="seedButton" disabled={isBusy} onClick={handleReseed} type="button">
          Re-seed Database
        </button>
      </div>
      {loading === 'status' && <p>Loading status…</p>}
      {loading && loading !== 'status' && <p>Working…</p>}
      {message && <p>{message}</p>}
    </div>
  )
}

export default SeedButton
