'use client'

import React, { useMemo, useRef, useState } from 'react'

import './index.scss'

type ImportStep = 'upload' | 'mapping' | 'review'

type ParsedFileData = {
  headers: string[]
  rows: Record<string, string>[]
}

type ColumnMapping = {
  name: string
  address?: string
  city?: string
  zipCode?: string
  country?: string
  emailColumns: string[]
  website?: string
  phone?: string
  googleMapsUrl?: string
}

type PreviewRow = {
  rowNumber: number
  name: string
  address?: string
  city?: string
  zipCode?: string
  country?: string
  website?: string
  phone?: string
  googleMapsUrl?: string
  emailOptions: string[]
  selectedEmail?: string
  hasEmailConflict: boolean
  invalid: boolean
}

type ImportedBusiness = {
  name: string
  email: string
  claimToken: string
  claimUrl: string
}

type FailedImport = {
  rowNumber: number
  name: string
  error: string
}

const FILE_ACCEPT = '.csv,.xlsx'

const normalizeHeader = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')

const unique = (values: string[]) => [...new Set(values)]

const normalizeRows = (matrix: string[][]): ParsedFileData => {
  const nonEmptyRows = matrix
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length > 0))

  if (nonEmptyRows.length < 2) {
    throw new Error('File must include a header row and at least one data row.')
  }

  const rawHeaders = nonEmptyRows[0]
  const headers: string[] = []
  const seen = new Map<string, number>()

  rawHeaders.forEach((value, index) => {
    const fallback = `Column ${index + 1}`
    const headerBase = value || fallback
    const count = seen.get(headerBase) || 0
    seen.set(headerBase, count + 1)
    headers.push(count === 0 ? headerBase : `${headerBase} (${count + 1})`)
  })

  const rows = nonEmptyRows.slice(1).map((row) => {
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = row[index] || ''
    })
    return record
  })

  return { headers, rows }
}

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentCell = ''
  let inQuotes = false

  const pushCell = () => {
    currentRow.push(currentCell)
    currentCell = ''
  }

  const pushRow = () => {
    pushCell()
    rows.push(currentRow)
    currentRow = []
  }

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          currentCell += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        currentCell += character
      }
      continue
    }

    if (character === '"') {
      inQuotes = true
      continue
    }

    if (character === ',') {
      pushCell()
      continue
    }

    if (character === '\n') {
      pushRow()
      continue
    }

    if (character === '\r') {
      continue
    }

    currentCell += character
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    pushRow()
  }

  return rows
}

const findEndOfCentralDirectory = (view: DataView) => {
  const end = view.byteLength - 22
  const min = Math.max(0, view.byteLength - 65557)

  for (let offset = end; offset >= min; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      return offset
    }
  }

  throw new Error('Unsupported XLSX file: could not find ZIP directory.')
}

const inflateRaw = async (bytes: Uint8Array): Promise<Uint8Array> => {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser does not support XLSX import yet. Please use CSV.')
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  const arrayBuffer = await new Response(stream).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

const unzip = async (arrayBuffer: ArrayBuffer): Promise<Map<string, Uint8Array>> => {
  const view = new DataView(arrayBuffer)
  const bytes = new Uint8Array(arrayBuffer)
  const decoder = new TextDecoder('utf-8')
  const eocdOffset = findEndOfCentralDirectory(view)
  const centralDirectoryOffset = view.getUint32(eocdOffset + 16, true)
  const centralDirectorySize = view.getUint32(eocdOffset + 12, true)
  const endOfCentralDirectory = centralDirectoryOffset + centralDirectorySize
  const files = new Map<string, Uint8Array>()

  let pointer = centralDirectoryOffset

  while (pointer < endOfCentralDirectory) {
    const signature = view.getUint32(pointer, true)
    if (signature !== 0x02014b50) {
      break
    }

    const compressionMethod = view.getUint16(pointer + 10, true)
    const compressedSize = view.getUint32(pointer + 20, true)
    const fileNameLength = view.getUint16(pointer + 28, true)
    const extraFieldLength = view.getUint16(pointer + 30, true)
    const commentLength = view.getUint16(pointer + 32, true)
    const localHeaderOffset = view.getUint32(pointer + 42, true)
    const fileNameBytes = bytes.slice(pointer + 46, pointer + 46 + fileNameLength)
    const fileName = decoder.decode(fileNameBytes)

    const localSignature = view.getUint32(localHeaderOffset, true)
    if (localSignature !== 0x04034b50) {
      throw new Error('Unsupported XLSX file: invalid local file header.')
    }

    const localFileNameLength = view.getUint16(localHeaderOffset + 26, true)
    const localExtraFieldLength = view.getUint16(localHeaderOffset + 28, true)
    const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength
    const compressedData = bytes.slice(dataStart, dataStart + compressedSize)

    let content: Uint8Array
    if (compressionMethod === 0) {
      content = compressedData
    } else if (compressionMethod === 8) {
      content = await inflateRaw(compressedData)
    } else {
      throw new Error(`Unsupported XLSX compression method: ${compressionMethod}`)
    }

    files.set(fileName, content)
    pointer += 46 + fileNameLength + extraFieldLength + commentLength
  }

  return files
}

const xmlDocumentFromBytes = (content: Uint8Array) => {
  const xml = new TextDecoder('utf-8').decode(content)
  return new DOMParser().parseFromString(xml, 'application/xml')
}

const normalizeXlsxPath = (target: string) => {
  const cleaned = target.replace(/^\.?\//, '').replace(/^\/+/, '')
  return cleaned.startsWith('xl/') ? cleaned : `xl/${cleaned}`
}

const getWorksheetPath = (files: Map<string, Uint8Array>) => {
  const workbook = files.get('xl/workbook.xml')
  if (!workbook) throw new Error('Invalid XLSX file: missing workbook.xml')
  const workbookRels = files.get('xl/_rels/workbook.xml.rels')
  if (!workbookRels) throw new Error('Invalid XLSX file: missing workbook relations.')

  const workbookDocument = xmlDocumentFromBytes(workbook)
  const relationshipDocument = xmlDocumentFromBytes(workbookRels)
  const firstSheet = workbookDocument.getElementsByTagName('sheet')[0]
  if (!firstSheet) throw new Error('Invalid XLSX file: no worksheets found.')

  const relationshipId =
    firstSheet.getAttribute('r:id') ||
    firstSheet.getAttributeNS(
      'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'id',
    )
  if (!relationshipId) throw new Error('Invalid XLSX file: missing worksheet relationship.')

  const relationships = Array.from(relationshipDocument.getElementsByTagName('Relationship'))
  const sheetRelationship = relationships.find(
    (relationship) => relationship.getAttribute('Id') === relationshipId,
  )
  if (!sheetRelationship) throw new Error('Invalid XLSX file: worksheet relationship not found.')

  const target = sheetRelationship.getAttribute('Target')
  if (!target) throw new Error('Invalid XLSX file: worksheet target not found.')

  return normalizeXlsxPath(target)
}

const columnToIndex = (cellRef: string) => {
  const letters = cellRef.replace(/[0-9]/g, '').toUpperCase()
  let result = 0

  for (let i = 0; i < letters.length; i += 1) {
    result = result * 26 + (letters.charCodeAt(i) - 64)
  }

  return Math.max(0, result - 1)
}

const extractSharedStrings = (files: Map<string, Uint8Array>) => {
  const sharedStringsXml = files.get('xl/sharedStrings.xml')
  if (!sharedStringsXml) return []

  const document = xmlDocumentFromBytes(sharedStringsXml)
  const entries = Array.from(document.getElementsByTagName('si'))

  return entries.map((entry) => {
    const textParts = Array.from(entry.getElementsByTagName('t'))
    return textParts.map((node) => node.textContent || '').join('')
  })
}

const getCellValue = (cell: Element, sharedStrings: string[]) => {
  const type = cell.getAttribute('t')

  if (type === 'inlineStr') {
    const inlineNode = cell.getElementsByTagName('t')[0]
    return inlineNode?.textContent || ''
  }

  const valueNode = cell.getElementsByTagName('v')[0]
  const rawValue = valueNode?.textContent || ''

  if (type === 's') {
    const index = Number(rawValue)
    return Number.isFinite(index) ? sharedStrings[index] || '' : ''
  }

  if (type === 'b') {
    return rawValue === '1' ? 'TRUE' : 'FALSE'
  }

  return rawValue
}

const parseXlsx = async (arrayBuffer: ArrayBuffer): Promise<string[][]> => {
  const files = await unzip(arrayBuffer)
  const worksheetPath = getWorksheetPath(files)
  const worksheetXml = files.get(worksheetPath)
  if (!worksheetXml) throw new Error(`Invalid XLSX file: missing worksheet ${worksheetPath}.`)

  const sharedStrings = extractSharedStrings(files)
  const document = xmlDocumentFromBytes(worksheetXml)
  const rows = Array.from(document.getElementsByTagName('row'))
  const matrix = new Map<number, Map<number, string>>()
  let maxColumnIndex = 0
  let fallbackRowIndex = 1

  rows.forEach((rowNode) => {
    const explicitRow = Number(rowNode.getAttribute('r') || '')
    const rowIndex = Number.isFinite(explicitRow) && explicitRow > 0 ? explicitRow : fallbackRowIndex
    fallbackRowIndex = rowIndex + 1

    const cellMap = matrix.get(rowIndex) || new Map<number, string>()
    const cells = Array.from(rowNode.getElementsByTagName('c'))

    let fallbackColumn = 0
    cells.forEach((cellNode) => {
      const ref = cellNode.getAttribute('r')
      const columnIndex = ref ? columnToIndex(ref) : fallbackColumn
      fallbackColumn = columnIndex + 1
      maxColumnIndex = Math.max(maxColumnIndex, columnIndex)

      const value = getCellValue(cellNode, sharedStrings)
      cellMap.set(columnIndex, value)
    })

    matrix.set(rowIndex, cellMap)
  })

  const rowIndexes = Array.from(matrix.keys()).sort((a, b) => a - b)
  const output: string[][] = []

  rowIndexes.forEach((rowIndex) => {
    const row = matrix.get(rowIndex)
    if (!row) return

    const values: string[] = []
    for (let columnIndex = 0; columnIndex <= maxColumnIndex; columnIndex += 1) {
      values.push((row.get(columnIndex) || '').trim())
    }
    output.push(values)
  })

  return output
}

const parseFile = async (file: File): Promise<ParsedFileData> => {
  if (file.name.toLowerCase().endsWith('.csv')) {
    const text = await file.text()
    return normalizeRows(parseCsv(text))
  }

  if (file.name.toLowerCase().endsWith('.xlsx')) {
    const arrayBuffer = await file.arrayBuffer()
    const matrix = await parseXlsx(arrayBuffer)
    return normalizeRows(matrix)
  }

  throw new Error('Unsupported file type. Use .csv or .xlsx.')
}

const findHeader = (headers: string[], aliases: string[]) => {
  const normalizedAliases = aliases.map(normalizeHeader)

  const exactMatch = headers.find((header) => normalizedAliases.includes(normalizeHeader(header)))
  if (exactMatch) return exactMatch

  return headers.find((header) => {
    const normalized = normalizeHeader(header)
    return normalizedAliases.some(
      (alias) => normalized.includes(alias) || alias.includes(normalized),
    )
  })
}

const autoDetectMapping = (headers: string[]): ColumnMapping => {
  const emailColumns = headers.filter((header) => normalizeHeader(header).includes('email'))

  return {
    name: findHeader(headers, ['name', 'firmname', 'companyname', 'businessname']) || '',
    address: findHeader(headers, ['address', 'streetaddress']),
    city: findHeader(headers, ['city', 'town']),
    zipCode: findHeader(headers, ['zipcode', 'postalcode', 'postcode', 'zip']),
    country: findHeader(headers, ['country']),
    emailColumns,
    website: findHeader(headers, ['website', 'url', 'web']),
    phone: findHeader(headers, ['phone', 'telephone', 'mobile']),
    googleMapsUrl: findHeader(headers, ['googlemaps', 'mapsurl', 'mapsembed', 'mapurl']),
  }
}

const extractEmails = (value: string) => {
  const matches = value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
  return unique(matches.map((entry) => entry.trim()))
}

const escapeCsvValue = (value: string) => {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const BusinessesImportTool: React.FC = () => {
  const [step, setStep] = useState<ImportStep>('upload')
  const [fileName, setFileName] = useState<string>('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedFileData | null>(null)
  const [mapping, setMapping] = useState<ColumnMapping | null>(null)
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])
  const [emailSelections, setEmailSelections] = useState<Record<number, string>>({})
  const [isImporting, setIsImporting] = useState(false)
  const [importedBusinesses, setImportedBusinesses] = useState<ImportedBusiness[]>([])
  const [failedImports, setFailedImports] = useState<FailedImport[]>([])
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const invalidCount = useMemo(
    () => previewRows.filter((row) => row.invalid).length,
    [previewRows],
  )
  const readyCount = useMemo(
    () => previewRows.filter((row) => !row.invalid).length,
    [previewRows],
  )
  const unresolvedConflictCount = useMemo(
    () =>
      previewRows.filter(
        (row) =>
          row.hasEmailConflict && !row.invalid && !(emailSelections[row.rowNumber] || row.selectedEmail),
      ).length,
    [previewRows, emailSelections],
  )

  const onFileSelected = async (file?: File) => {
    if (!file) return

    setIsParsing(true)
    setParseError(null)
    setImportMessage(null)
    setImportedBusinesses([])
    setFailedImports([])
    setPreviewRows([])
    setEmailSelections({})

    try {
      const data = await parseFile(file)
      const nextMapping = autoDetectMapping(data.headers)

      setFileName(file.name)
      setParsedData(data)
      setMapping(nextMapping)
      setStep('mapping')
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Failed to parse file.')
      setStep('upload')
    } finally {
      setIsParsing(false)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    await onFileSelected(file)
  }

  const updateMapping = (field: keyof Omit<ColumnMapping, 'emailColumns'>, value: string) => {
    if (!mapping) return
    setMapping({
      ...mapping,
      [field]: value || undefined,
    })
  }

  const toggleEmailColumn = (column: string, checked: boolean) => {
    if (!mapping) return

    const next = checked
      ? unique([...mapping.emailColumns, column])
      : mapping.emailColumns.filter((value) => value !== column)

    setMapping({
      ...mapping,
      emailColumns: next,
    })
  }

  const buildPreview = () => {
    if (!parsedData || !mapping?.name) return

    const nextPreview = parsedData.rows.map((row, index) => {
      const name = (row[mapping.name] || '').trim()
      const emailOptions = unique(
        mapping.emailColumns.flatMap((column) => extractEmails((row[column] || '').trim())),
      )

      return {
        rowNumber: index + 2,
        name,
        address: mapping.address ? (row[mapping.address] || '').trim() : undefined,
        city: mapping.city ? (row[mapping.city] || '').trim() : undefined,
        zipCode: mapping.zipCode ? (row[mapping.zipCode] || '').trim() : undefined,
        country: mapping.country ? (row[mapping.country] || '').trim() : undefined,
        website: mapping.website ? (row[mapping.website] || '').trim() : undefined,
        phone: mapping.phone ? (row[mapping.phone] || '').trim() : undefined,
        googleMapsUrl: mapping.googleMapsUrl ? (row[mapping.googleMapsUrl] || '').trim() : undefined,
        emailOptions,
        selectedEmail: emailOptions.length === 1 ? emailOptions[0] : undefined,
        hasEmailConflict: emailOptions.length > 1,
        invalid: name.length === 0,
      } satisfies PreviewRow
    })

    const nextSelections: Record<number, string> = {}
    nextPreview.forEach((row) => {
      if (row.selectedEmail) {
        nextSelections[row.rowNumber] = row.selectedEmail
      }
    })

    setPreviewRows(nextPreview)
    setEmailSelections(nextSelections)
    setStep('review')
  }

  const runImport = async () => {
    if (!previewRows.length || unresolvedConflictCount > 0) return

    setIsImporting(true)
    setImportMessage(null)
    setImportedBusinesses([])
    setFailedImports([])

    const nextImported: ImportedBusiness[] = []
    const nextFailed: FailedImport[] = []
    const origin = window.location.origin

    for (const row of previewRows) {
      if (row.invalid) continue

      const selectedEmail = emailSelections[row.rowNumber] || row.selectedEmail || ''

      try {
        const requestBody = JSON.stringify({
          name: row.name,
          address: row.address,
          city: row.city,
          zipCode: row.zipCode,
          country: row.country,
          email: selectedEmail,
          website: row.website,
          phone: row.phone,
          googleMapsUrl: row.googleMapsUrl,
        })

        let response = await fetch('/api/import-business-row', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        })

        // Backward compatibility for an already-running server instance.
        if (response.status === 404) {
          response = await fetch('/api/businesses/import-row', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          })
        }

        const payload = (await response.json()) as
          | {
              success: true
              business: { name: string; email: string; claimToken: string }
            }
          | { success: false; error?: string }

        if (!response.ok || !payload.success) {
          nextFailed.push({
            rowNumber: row.rowNumber,
            name: row.name,
            error: payload.success ? 'Unknown error' : payload.error || 'Import failed.',
          })
          continue
        }

        nextImported.push({
          name: payload.business.name,
          email: payload.business.email,
          claimToken: payload.business.claimToken,
          claimUrl: `${origin}/claim/${payload.business.claimToken}`,
        })
      } catch (error) {
        nextFailed.push({
          rowNumber: row.rowNumber,
          name: row.name,
          error: error instanceof Error ? error.message : 'Network error.',
        })
      }
    }

    setImportedBusinesses(nextImported)
    setFailedImports(nextFailed)
    setImportMessage(`Import complete. ${nextImported.length} succeeded, ${nextFailed.length} failed.`)
    setIsImporting(false)
  }

  const exportImportedCsv = () => {
    if (!importedBusinesses.length) return

    const lines = [
      ['Firm Name', 'Email', 'Claim URL'].map(escapeCsvValue).join(','),
      ...importedBusinesses.map((entry) =>
        [entry.name, entry.email, entry.claimUrl].map(escapeCsvValue).join(','),
      ),
    ]

    const csvContent = `${lines.join('\n')}\n`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = 'imported-business-claim-links.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)
  }

  return (
    <section className="business-import-panel">
      <div className="business-import-panel__header">
        <h3>Bulk Import Businesses</h3>
        <p>Upload CSV or Excel, map columns, resolve email conflicts, then import published businesses.</p>
      </div>

      {step === 'upload' && (
        <div className="business-import-panel__upload">
          <div
            className={`business-import-panel__dropzone ${isDragging ? 'is-dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setIsDragging(false)
            }}
            onDragOver={(event) => {
              event.preventDefault()
            }}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                fileInputRef.current?.click()
              }
            }}
          >
            <p>Drop a `.csv` or `.xlsx` file here, or click to browse.</p>
            <input
              accept={FILE_ACCEPT}
              className="business-import-panel__file-input"
              onChange={(event) => void onFileSelected(event.target.files?.[0])}
              ref={fileInputRef}
              type="file"
            />
          </div>
          {isParsing && <p>Parsing file…</p>}
          {parseError && <p className="business-import-panel__error">{parseError}</p>}
        </div>
      )}

      {step === 'mapping' && parsedData && mapping && (
        <div className="business-import-panel__mapping">
          <p>
            <strong>File:</strong> {fileName} ({parsedData.rows.length} rows)
          </p>

          <div className="business-import-panel__mapping-grid">
            <label>
              Firm name (required)
              <select value={mapping.name || ''} onChange={(event) => updateMapping('name', event.target.value)}>
                <option value="">Select column</option>
                {parsedData.headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>

            {(
              [
                ['address', 'Address'],
                ['city', 'City'],
                ['zipCode', 'Zip code'],
                ['country', 'Country'],
                ['website', 'Website URL'],
                ['phone', 'Phone'],
                ['googleMapsUrl', 'Google Maps embed URL'],
              ] as const
            ).map(([field, label]) => (
              <label key={field}>
                {label}
                <select
                  value={mapping[field] || ''}
                  onChange={(event) => updateMapping(field, event.target.value)}
                >
                  <option value="">Ignore</option>
                  {parsedData.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <fieldset className="business-import-panel__email-mapping">
            <legend>Email columns (select one or more)</legend>
            <div className="business-import-panel__checkboxes">
              {parsedData.headers.map((header) => {
                const checked = mapping.emailColumns.includes(header)
                return (
                  <label key={header}>
                    <input
                      checked={checked}
                      onChange={(event) => toggleEmailColumn(header, event.target.checked)}
                      type="checkbox"
                    />
                    <span>{header}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="business-import-panel__actions">
            <button type="button" onClick={() => setStep('upload')}>
              Back
            </button>
            <button type="button" disabled={!mapping.name} onClick={buildPreview}>
              Preview
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="business-import-panel__review">
          <p>
            <strong>{readyCount}</strong> firms ready to import, <strong>{unresolvedConflictCount}</strong>{' '}
            rows with email conflicts to resolve, <strong>{invalidCount}</strong> invalid rows excluded.
          </p>

          <div className="business-import-panel__table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => {
                  const selected = emailSelections[row.rowNumber] || row.selectedEmail || ''
                  return (
                    <tr
                      className={row.invalid ? 'is-invalid' : row.hasEmailConflict ? 'is-conflict' : ''}
                      key={row.rowNumber}
                    >
                      <td>{row.rowNumber}</td>
                      <td>{row.name || '-'}</td>
                      <td>
                        {row.hasEmailConflict ? (
                          <div className="business-import-panel__email-options">
                            {row.emailOptions.map((email) => (
                              <label key={email}>
                                <input
                                  checked={selected === email}
                                  name={`row-email-${row.rowNumber}`}
                                  onChange={() =>
                                    setEmailSelections((current) => ({
                                      ...current,
                                      [row.rowNumber]: email,
                                    }))
                                  }
                                  type="radio"
                                />
                                <span>{email}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <span>{selected || 'No valid email detected'}</span>
                        )}
                      </td>
                      <td>
                        {row.invalid
                          ? 'Invalid: missing name'
                          : row.hasEmailConflict && !selected
                            ? 'Resolve email'
                            : 'Ready'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="business-import-panel__actions">
            <button type="button" onClick={() => setStep('mapping')} disabled={isImporting}>
              Back to mapping
            </button>
            <button
              type="button"
              onClick={() => void runImport()}
              disabled={isImporting || unresolvedConflictCount > 0}
            >
              {isImporting ? 'Importing…' : 'Import'}
            </button>
            <button type="button" onClick={exportImportedCsv} disabled={!importedBusinesses.length}>
              Export imported claim links CSV
            </button>
          </div>

          {importMessage && <p>{importMessage}</p>}

          {failedImports.length > 0 && (
            <div className="business-import-panel__failures">
              <h4>Failed rows</h4>
              <ul>
                {failedImports.map((failure) => (
                  <li key={`${failure.rowNumber}-${failure.name}`}>
                    Row {failure.rowNumber} ({failure.name || 'Unknown'}): {failure.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default BusinessesImportTool
