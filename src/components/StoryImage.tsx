'use client'
import { useState, useEffect, type CSSProperties } from 'react'
import Image from 'next/image'

export const STORY_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'

type Props = {
  src: string
  alt: string
  sizes: string
  /** Used when the feed URL fails to load (e.g. category-specific placeholder). */
  fallbackSrc?: string
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}

export default function StoryImage({
  src: initialSrc,
  alt,
  sizes,
  fallbackSrc,
  wrapperClassName,
  wrapperStyle,
}: Props) {
  const [src, setSrc] = useState(initialSrc)
  useEffect(() => {
    setSrc(initialSrc)
  }, [initialSrc])

  const onFail = () => setSrc(fallbackSrc ?? STORY_IMAGE_FALLBACK)

  return (
    <div className={wrapperClassName} style={{ position: 'relative', overflow: 'hidden', ...wrapperStyle }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        style={{ objectFit: 'cover', display: 'block' }}
        onError={onFail}
      />
    </div>
  )
}
