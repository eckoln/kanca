import { useCallback, useState } from 'react'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean>

interface UseCopyToClipboardReturn {
  isCopied: boolean
  copy: CopyFn
  copiedText: CopiedValue
}

function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setIsCopied(true)

      setTimeout(() => setIsCopied(false), 2000)

      return true
    } catch (error) {
      console.error('Copy failed', error)
      setCopiedText(null)
      setIsCopied(false)
      return false
    }
  }, [])

  return { isCopied, copy, copiedText }
}

export { useCopyToClipboard }
