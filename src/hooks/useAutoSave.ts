import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoSaveOptions {
  key: string
  data: any
  delay?: number
  onSave?: () => void
  onError?: (error: Error) => void
}

interface UseAutoSaveReturn {
  isSaving: boolean
  lastSaved: Date | null
  saveNow: () => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

export const useAutoSave = ({
  key,
  data,
  delay = 2000,
  onSave,
  onError
}: UseAutoSaveOptions): UseAutoSaveReturn => {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<string>('')

  const saveData = useCallback(() => {
    try {
      setIsSaving(true)
      setSaveStatus('saving')

      const serializedData = JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString()
      })

      localStorage.setItem(key, serializedData)

      setLastSaved(new Date())
      setSaveStatus('saved')
      setIsSaving(false)

      if (onSave) {
        onSave()
      }

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)
    } catch (error) {
      setIsSaving(false)
      setSaveStatus('error')

      if (onError) {
        onError(error as Error)
      }

      console.error('Auto-save error:', error)
    }
  }, [key, data, onSave, onError])

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    saveData()
  }, [saveData])

  useEffect(() => {
    const serializedData = JSON.stringify(data)

    // Only save if data has actually changed
    if (serializedData === previousDataRef.current) {
      return
    }

    previousDataRef.current = serializedData

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveData()
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, saveData])

  // Save on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Force save on unmount
      try {
        const serializedData = JSON.stringify({
          ...data,
          lastUpdated: new Date().toISOString()
        })
        localStorage.setItem(key, serializedData)
      } catch (error) {
        console.error('Error saving on unmount:', error)
      }
    }
  }, [key, data])

  return {
    isSaving,
    lastSaved,
    saveNow,
    saveStatus
  }
}
