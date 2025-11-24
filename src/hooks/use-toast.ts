import { useCallback, useState } from 'react'

export type ToastVariant = 'info' | 'error' | 'success'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = useCallback((toast: Omit<Toast, 'id'> & { id?: string }) => {
    const id = toast.id ?? crypto.randomUUID?.() ?? String(Date.now())
    setToasts((current) => [...current, { ...toast, id }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  return { toasts, pushToast, dismiss }
}
