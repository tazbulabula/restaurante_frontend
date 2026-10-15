import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui'

export type ShowcasePhoto = {
  src: string
  alt: string
  name: string
  description: string
  category: string
}

type FoodPhotoShowcaseProps = {
  photos: ShowcasePhoto[]
  beverages?: ShowcasePhoto[]
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionHref: string
  tone?: 'dark' | 'light'
}

type PhotoFrameProps = {
  photos: ShowcasePhoto[]
  initialIndex: number
  className: string
  featured?: boolean
}

function PhotoFrame({
  photos,
  initialIndex,
  className,
  featured = false,
}: PhotoFrameProps) {
  const [photoIndex, setPhotoIndex] = useState(initialIndex % photos.length)
  const [failedSources, setFailedSources] = useState<string[]>([])
  const shouldReduceMotion = useReducedMotion()
  const photo = photos[photoIndex]
  const imageFailed = failedSources.includes(photo.src)

  useEffect(() => {
    if (shouldReduceMotion || photos.length < 2) return

    let timeoutId: number

    const scheduleNextPhoto = () => {
      timeoutId = window.setTimeout(() => {
        setPhotoIndex(currentIndex => {
          const offset = Math.floor(Math.random() * (photos.length - 1)) + 1
          return (currentIndex + offset) % photos.length
        })
        scheduleNextPhoto()
      }, 4200 + Math.random() * 3600)
    }

    scheduleNextPhoto()
    return () => window.clearTimeout(timeoutId)
  }, [photos.length, shouldReduceMotion])

  return (
    <div
      role="group"
      aria-label={`${photo.category}: ${photo.name}`}
      className={`relative isolate overflow-hidden rounded-xl bg-brown-800 ${className}`}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={photo.src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {imageFailed ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brown-700 via-brown-900 to-gold-900">
              <Utensils
                aria-hidden="true"
                className="h-12 w-12 text-gold-300/50"
              />
            </div>
          ) : (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() =>
                setFailedSources(current => [...current, photo.src])
              }
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brown-900/90 via-brown-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">
              {photo.category}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-white md:text-2xl">
              {photo.name}
            </h3>
            {featured && (
              <p className="mt-1 max-w-md text-sm leading-relaxed text-cream-100/85">
                {photo.description}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function FoodPhotoShowcase({
  photos,
  beverages = [],
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  tone = 'dark',
}: FoodPhotoShowcaseProps) {
  if (photos.length === 0) return null

  const isDark = tone === 'dark'

  return (
    <section
      aria-label={eyebrow}
      className={`py-14 md:py-20 ${isDark ? 'bg-brown-900 text-cream-50' : 'bg-cream-100 text-brown-900'}`}
    >
      <Container>
        <div className="grid items-center gap-9 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gold-400' : 'text-gold-700'}`}>
              {eyebrow}
            </p>
            <h2 className={`mt-3 max-w-lg font-display text-3xl font-bold leading-tight md:text-4xl ${isDark ? 'text-cream-50' : 'text-brown-900'}`}>
              {title}
            </h2>
            <p className={`mt-4 max-w-lg leading-relaxed ${isDark ? 'text-cream-100/75' : 'text-brown-600'}`}>
              {description}
            </p>
            <Link
              to={actionHref}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold-500 px-5 py-3 font-semibold text-brown-900 transition-colors hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              {actionLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.15fr_0.85fr] md:grid-rows-2 md:gap-4">
            <PhotoFrame
              photos={photos}
              initialIndex={0}
              featured
              className="col-span-2 aspect-[16/10] md:col-span-1 md:row-span-2 md:aspect-auto md:min-h-[25rem]"
            />
            <PhotoFrame
              photos={photos}
              initialIndex={1}
              className="aspect-[4/3] md:aspect-auto"
            />
            <PhotoFrame
              photos={beverages.length > 0 ? beverages : photos}
              initialIndex={2}
              className="aspect-[4/3] md:aspect-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}