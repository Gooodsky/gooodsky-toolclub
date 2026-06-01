'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 p-1 rounded text-on-surface-variant/40 hover:text-primary hover:bg-primary-light transition opacity-0 group-hover:opacity-100"
      title="复制"
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
    </button>
  )
}
