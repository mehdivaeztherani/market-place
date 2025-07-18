"use client"

import Image from "next/image"
import { useState } from "react"

type AgentProfileImageProps = {
  src: string
  alt: string
  className?: string
}

export default function AgentProfileImage({ src, alt, className }: AgentProfileImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    // Show fallback (initials or placeholder)
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-300">
        <span className="text-white font-semibold text-lg">?</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setError(true)}
    />
  )
} 