// src/components/ui/use-toast.js
import { useState, useEffect } from 'react'

const TOAST_LIFETIME = 5000 // 5 seconds

const useToast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => {
          return Date.now() - toast.createdAt < (toast.duration || TOAST_LIFETIME)
        })
      )
    }, 100)

    return () => clearInterval(timer)
  }, [])

  const toast = ({
    title,
    description,
    action,
    variant = "default",
    duration = TOAST_LIFETIME,
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      id,
      title,
      description,
      action,
      variant,
      duration,
      createdAt: Date.now(),
    }
    setToasts((prevToasts) => [...prevToasts, newToast])
    return id
  }

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    toast,
    dismissToast,
  }
}

export { useToast }