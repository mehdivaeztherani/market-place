"use client"

import Image from "next/image"
import { useState } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  fallbackSrc?: string
  onError?: () => void
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  sizes,
  fallbackSrc = "/placeholder.svg",
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    console.log(`Image failed to load: ${imgSrc}`)
    setHasError(true)
    setImgSrc(fallbackSrc)
    if (onError) {
      onError()
    }
  }

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${imgSrc}`)
  }

  // If we've tried the fallback and it also failed, show a div with initials
  if (hasError && imgSrc === fallbackSrc) {
    const initials = alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div 
        className={`${className} bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-lg">{initials || '?'}</span>
      </div>
    )
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    sizes,
    ...props
  }

  if (fill) {
    return <Image {...imageProps} fill />
  }

  return <Image {...imageProps} width={width} height={height} />
}