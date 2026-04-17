'use client'
import { useState, useEffect, type CSSProperties } from 'react'
import Image from 'next/image'

export const STORY_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=85'

type Props = {
  src: string
  alt: string
  sizes: string
  fallbackSrc?: string
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
  /** Controls which part of the image is visible. Default: 'top center' */
  objectPosition?: string
}

export default function StoryImage({
  src: initialSrc,
  alt,
  sizes,
  fallbackSrc,
  wrapperClassName,
  wrapperStyle,
  objectPosition = 'top center',
}: Props) {
  const [src, setSrc] = useState(initialSrc)
  useEffect(() => { setSrc(initialSrc) }, [initialSrc])

  const onFail = () => setSrc(fallbackSrc ?? STORY_IMAGE_FALLBACK)

  return (
    <div
      className={wrapperClassName}
      style={{ position: 'relative', overflow: 'hidden', ...wrapperStyle }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={85}
        style={{ objectFit: 'cover', objectPosition, display: 'block' }}
        onError={onFail}
      />
    </div>
  )
}
