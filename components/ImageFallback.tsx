'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

type ImageFallbackProps = ImageProps & {
  fallbackSrc?: string;
}

export default function ImageFallback({
  src,
  fallbackSrc = "/images/placeholder.png",
  alt,
  ...props
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
} 