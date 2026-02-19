'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ProfileImageGalleryProps {
  images: Array<{
    id: string
    url: string
    alt: string
  }>
}

export function ProfileImageGallery({ images }: ProfileImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showAllPreviews, setShowAllPreviews] = useState(false)

  const activeImage = useMemo(
    () => (typeof activeIndex === 'number' ? images[activeIndex] : null),
    [activeIndex, images],
  )

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          if (prev === null) return prev
          return prev === 0 ? images.length - 1 : prev - 1
        })
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          if (prev === null) return prev
          return prev === images.length - 1 ? 0 : prev + 1
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, images.length])

  if (!images.length) return null

  const previewImages = showAllPreviews ? images : images.slice(0, 3)
  const hiddenCount = images.length - previewImages.length
  const openAt = (index: number) => setActiveIndex(index)
  const showPrev = () =>
    setActiveIndex((prev) => (prev === null ? prev : prev === 0 ? images.length - 1 : prev - 1))
  const showNext = () =>
    setActiveIndex((prev) =>
      prev === null ? prev : prev === images.length - 1 ? 0 : prev + 1,
    )

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {previewImages.map((image) => {
          const index = images.findIndex((item) => item.id === image.id)
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => openAt(index)}
              className="relative h-32 overflow-hidden rounded-xl border border-warm-200 bg-white sm:h-36"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 320px"
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </button>
          )
        })}
      </div>

      {!showAllPreviews && images.length > 3 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAllPreviews(true)}
            className="inline-flex items-center rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-sm font-medium text-royal-700 transition-colors hover:bg-cream-50"
          >
            Show all {images.length} images
          </button>
        </div>
      )}

      {activeImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 p-4 sm:p-8" role="dialog" aria-modal="true">
          <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col">
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-0 top-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close image gallery"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative mt-12 flex-1 overflow-hidden rounded-xl">
              <Image
                src={activeImage.url}
                alt={activeImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => {
                  const selected = index === activeIndex
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border ${selected ? 'border-gold-500' : 'border-white/20'}`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
