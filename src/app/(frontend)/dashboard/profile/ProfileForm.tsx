'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { saveDashboardProfileAction } from './actions'
import {
  initialDashboardProfileActionState,
  type DashboardBusinessProfileData,
  type DashboardPracticeAreaOption,
  type SupportedCurrencyCode,
} from './types'

type ProfileFormProps = {
  business: DashboardBusinessProfileData
  practiceAreas: DashboardPracticeAreaOption[]
}

type ServiceRow = {
  rowId: string
  serviceName: string
  price: string
  currency: SupportedCurrencyCode
}

type PracticeAreaDraft = {
  description: string
  priceMin: string
}

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024

const toCheckedBoolean = (checked: CheckedState) => checked === true

const buildRowId = () => `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const fileToDataURL = async (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Unable to preview selected file.'))
    }
    reader.onerror = () => reject(new Error('Unable to read selected file.'))
    reader.readAsDataURL(file)
  })

export const ProfileForm = ({ business, practiceAreas }: ProfileFormProps) => {
  const [actionState, formAction, isPending] = useActionState(
    saveDashboardProfileAction,
    initialDashboardProfileActionState,
  )

  const [logoId, setLogoId] = useState<number | null>(business.logo?.id || null)
  const [coverImageId, setCoverImageId] = useState<number | null>(business.coverImage?.id || null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(business.logo?.url || null)
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(
    business.coverImage?.url || null,
  )
  const [isLogoUploading, setIsLogoUploading] = useState(false)
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [description, setDescription] = useState(business.description || '')
  const [address, setAddress] = useState(business.address || '')
  const [phone, setPhone] = useState(business.phone || '')
  const [email, setEmail] = useState(business.email || '')
  const [website, setWebsite] = useState(business.website || '')

  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<number[]>(business.practiceAreas || [])
  const [practiceAreaDrafts, setPracticeAreaDrafts] = useState<Record<number, PracticeAreaDraft>>(() => {
    const drafts: Record<number, PracticeAreaDraft> = {}

    business.practiceAreaDetails.forEach((detail) => {
      drafts[detail.practiceArea] = {
        description: detail.description || '',
        priceMin: detail.priceMin !== null ? String(detail.priceMin) : '',
      }
    })

    return drafts
  })

  const [serviceRows, setServiceRows] = useState<ServiceRow[]>(() =>
    business.servicePricing.map((item, index) => ({
      rowId: `existing-${index}`,
      serviceName: item.serviceName || '',
      price: item.price !== null ? String(item.price) : '',
      currency: item.currency || 'THB',
    })),
  )

  const [feeRangeMin, setFeeRangeMin] = useState(
    business.feeRangeMin !== null ? String(business.feeRangeMin) : '',
  )
  const [feeRangeMax, setFeeRangeMax] = useState(
    business.feeRangeMax !== null ? String(business.feeRangeMax) : '',
  )
  const [feeCurrency, setFeeCurrency] = useState<SupportedCurrencyCode | ''>(business.feeCurrency || 'THB')

  const [showSuccessToast, setShowSuccessToast] = useState(false)

  useEffect(() => {
    if (!actionState.success) return

    setShowSuccessToast(true)
    const timeoutId = window.setTimeout(() => setShowSuccessToast(false), 3200)

    return () => window.clearTimeout(timeoutId)
  }, [actionState.success, actionState.message])

  const descriptionRemaining = useMemo(() => 800 - description.length, [description.length])

  const setMediaState = ({
    field,
    id,
    previewUrl,
  }: {
    field: 'logo' | 'coverImage'
    id: number | null
    previewUrl: string | null
  }) => {
    if (field === 'logo') {
      setLogoId(id)
      setLogoPreviewUrl(previewUrl)
      return
    }

    setCoverImageId(id)
    setCoverImagePreviewUrl(previewUrl)
  }

  const uploadMedia = async ({ field, file }: { field: 'logo' | 'coverImage'; file: File }) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setUploadError('Image size must be 2MB or less.')
      return
    }

    setUploadError(null)

    if (field === 'logo') setIsLogoUploading(true)
    else setIsCoverImageUploading(true)

    try {
      const localPreviewUrl = await fileToDataURL(file)
      setMediaState({ field, id: field === 'logo' ? logoId : coverImageId, previewUrl: localPreviewUrl })

      const body = new FormData()
      body.append('file', file)

      const response = await fetch('/api/media', {
        method: 'POST',
        body,
        credentials: 'include',
      })

      const payload = (await response.json().catch(() => null)) as
        | { id?: number; url?: string | null; doc?: { id?: number; url?: string | null } }
        | null

      if (!response.ok) {
        throw new Error('Upload failed. Please try again.')
      }

      const uploadedMedia = payload?.doc ?? payload
      const uploadedId = typeof uploadedMedia?.id === 'number' ? uploadedMedia.id : null

      if (!uploadedId) {
        throw new Error('Upload failed. Please try again.')
      }

      setMediaState({
        field,
        id: uploadedId,
        previewUrl:
          typeof uploadedMedia?.url === 'string' && uploadedMedia.url.length > 0
            ? uploadedMedia.url
            : localPreviewUrl,
      })
    } catch (error) {
      console.error('Media upload failed:', error)
      setUploadError('Unable to upload image. Please try again.')
    } finally {
      if (field === 'logo') setIsLogoUploading(false)
      else setIsCoverImageUploading(false)
    }
  }

  const onMediaInputChange =
    (field: 'logo' | 'coverImage') => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await uploadMedia({ field, file })
      event.target.value = ''
    }

  const isPracticeAreaSelected = (practiceAreaId: number) =>
    selectedPracticeAreas.includes(practiceAreaId)

  const togglePracticeArea = (practiceAreaId: number, checked: CheckedState) => {
    const isChecked = toCheckedBoolean(checked)

    setSelectedPracticeAreas((current) => {
      if (isChecked) {
        return current.includes(practiceAreaId) ? current : [...current, practiceAreaId]
      }

      return current.filter((value) => value !== practiceAreaId)
    })

    setPracticeAreaDrafts((current) => {
      if (isChecked) {
        return {
          ...current,
          [practiceAreaId]: current[practiceAreaId] || { description: '', priceMin: '' },
        }
      }

      const next = { ...current }
      delete next[practiceAreaId]
      return next
    })
  }

  const setPracticeAreaDescription = (practiceAreaId: number, value: string) => {
    setPracticeAreaDrafts((current) => ({
      ...current,
      [practiceAreaId]: {
        ...(current[practiceAreaId] || { description: '', priceMin: '' }),
        description: value,
      },
    }))
  }

  const setPracticeAreaPrice = (practiceAreaId: number, value: string) => {
    setPracticeAreaDrafts((current) => ({
      ...current,
      [practiceAreaId]: {
        ...(current[practiceAreaId] || { description: '', priceMin: '' }),
        priceMin: value,
      },
    }))
  }

  const addServiceRow = () => {
    setServiceRows((rows) => [
      ...rows,
      {
        rowId: buildRowId(),
        serviceName: '',
        price: '',
        currency: 'THB',
      },
    ])
  }

  const removeServiceRow = (rowId: string) => {
    setServiceRows((rows) => rows.filter((row) => row.rowId !== rowId))
  }

  const updateServiceRow = (rowId: string, updates: Partial<ServiceRow>) => {
    setServiceRows((rows) =>
      rows.map((row) => (row.rowId === rowId ? { ...row, ...updates } : row)),
    )
  }

  return (
    <>
      {showSuccessToast && actionState.message ? (
        <div className="fixed top-4 right-4 z-50 rounded-md bg-royal-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {actionState.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="logoId" value={logoId ?? ''} />
        <input type="hidden" name="coverImageId" value={coverImageId ?? ''} />
        <input type="hidden" name="feeCurrency" value={feeCurrency || ''} />

        <section className="space-y-4 rounded-xl border border-warm-200 bg-cream-50/50 p-5">
          <h3 className="font-heading text-xl text-royal-900">Identity</h3>
          <p className="text-sm text-royal-700/80">Upload logo and cover images (max 2MB each).</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo</Label>
              <Input id="logo-upload" type="file" accept="image/*" onChange={onMediaInputChange('logo')} />
              {isLogoUploading ? <p className="text-xs text-royal-700/70">Uploading logo...</p> : null}
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  alt="Logo preview"
                  className="h-20 w-20 rounded-md border border-warm-200 object-cover"
                />
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-upload">Cover Image</Label>
              <Input id="cover-upload" type="file" accept="image/*" onChange={onMediaInputChange('coverImage')} />
              {isCoverImageUploading ? <p className="text-xs text-royal-700/70">Uploading cover image...</p> : null}
              {coverImagePreviewUrl ? (
                <img
                  src={coverImagePreviewUrl}
                  alt="Cover image preview"
                  className="h-20 w-full rounded-md border border-warm-200 object-cover"
                />
              ) : null}
            </div>
          </div>

          {uploadError ? <p className="text-sm font-medium text-red-700">{uploadError}</p> : null}
        </section>

        <section className="space-y-4 rounded-xl border border-warm-200 bg-cream-50/50 p-5">
          <h3 className="font-heading text-xl text-royal-900">About</h3>
          <div className="space-y-2">
            <Label htmlFor="description">Introduction</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={800}
              rows={6}
              placeholder="Introduce your firm and explain what makes your practice unique."
            />
            <p className={`text-xs ${descriptionRemaining >= 0 ? 'text-royal-700/75' : 'text-red-700'}`}>
              {descriptionRemaining} characters remaining
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-warm-200 bg-cream-50/50 p-5">
          <h3 className="font-heading text-xl text-royal-900">Contact</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-warm-200 bg-cream-50/50 p-5">
          <h3 className="font-heading text-xl text-royal-900">Practice Areas And Services</h3>
          <p className="text-sm text-royal-700/80">
            Select each practice area you offer and describe your services with a starting price.
          </p>

          <div className="space-y-4">
            {practiceAreas.map((practiceArea) => {
              const checked = isPracticeAreaSelected(practiceArea.id)
              const draft = practiceAreaDrafts[practiceArea.id] || { description: '', priceMin: '' }

              return (
                <div key={practiceArea.id} className="space-y-3 rounded-lg border border-warm-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`practice-area-${practiceArea.id}`}
                      checked={checked}
                      onCheckedChange={(state) => togglePracticeArea(practiceArea.id, state)}
                    />
                    <Label htmlFor={`practice-area-${practiceArea.id}`} className="cursor-pointer text-royal-900">
                      {practiceArea.name}
                    </Label>
                  </div>

                  {checked ? (
                    <div className="space-y-3 rounded-md border border-warm-200 bg-cream-50 p-4">
                      <input type="hidden" name="practiceAreaIds" value={practiceArea.id} />
                      <div className="space-y-2">
                        <Label htmlFor={`practice-area-description-${practiceArea.id}`}>
                          Describe what you offer in this area
                        </Label>
                        <Textarea
                          id={`practice-area-description-${practiceArea.id}`}
                          name={`practiceAreaDescription-${practiceArea.id}`}
                          value={draft.description}
                          onChange={(event) =>
                            setPracticeAreaDescription(practiceArea.id, event.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`practice-area-price-${practiceArea.id}`}>Starting from (THB)</Label>
                        <Input
                          id={`practice-area-price-${practiceArea.id}`}
                          name={`practiceAreaPriceMin-${practiceArea.id}`}
                          type="number"
                          min={0}
                          value={draft.priceMin}
                          onChange={(event) => setPracticeAreaPrice(practiceArea.id, event.target.value)}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-warm-200 bg-cream-50/50 p-5">
          <h3 className="font-heading text-xl text-royal-900">Fixed-Price Services</h3>

          <div className="space-y-4">
            {serviceRows.length === 0 ? (
              <p className="text-sm text-royal-700/75">No services added yet.</p>
            ) : null}

            {serviceRows.map((row) => (
              <div key={row.rowId} className="rounded-lg border border-warm-200 bg-white p-4">
                <input type="hidden" name="serviceRowIds" value={row.rowId} />
                <input type="hidden" name={`serviceCurrency-${row.rowId}`} value={row.currency} />

                <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`service-name-${row.rowId}`}>Service Name</Label>
                    <Input
                      id={`service-name-${row.rowId}`}
                      name={`serviceName-${row.rowId}`}
                      value={row.serviceName}
                      onChange={(event) =>
                        updateServiceRow(row.rowId, { serviceName: event.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`service-price-${row.rowId}`}>Price</Label>
                    <Input
                      id={`service-price-${row.rowId}`}
                      name={`servicePrice-${row.rowId}`}
                      type="number"
                      min={0}
                      value={row.price}
                      onChange={(event) => updateServiceRow(row.rowId, { price: event.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={row.currency}
                      onValueChange={(value) =>
                        updateServiceRow(row.rowId, {
                          currency: value as SupportedCurrencyCode,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="THB">THB</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="sm:mb-0.5"
                    onClick={() => removeServiceRow(row.rowId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addServiceRow}>
            Add Service
          </Button>
        </section>

        <section className="space-y-4 rounded-xl border border-warm-200 bg-cream-50/50 p-5">
          <h3 className="font-heading text-xl text-royal-900">Fee Range</h3>
          <p className="text-sm text-royal-700/80">
            Providing a fee range helps clients self-qualify before making contact.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fee-range-min">Minimum fee</Label>
              <Input
                id="fee-range-min"
                name="feeRangeMin"
                type="number"
                min={0}
                value={feeRangeMin}
                onChange={(event) => setFeeRangeMin(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee-range-max">Maximum fee</Label>
              <Input
                id="fee-range-max"
                name="feeRangeMax"
                type="number"
                min={0}
                value={feeRangeMax}
                onChange={(event) => setFeeRangeMax(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={feeCurrency || 'THB'} onValueChange={(value) => setFeeCurrency(value as SupportedCurrencyCode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {actionState.error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionState.error}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || isLogoUploading || isCoverImageUploading}
            className="bg-royal-700 text-white hover:bg-royal-600 disabled:opacity-60"
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </>
  )
}
