import React, { useEffect } from 'react'
import { ToastBar, Toaster, toast } from 'react-hot-toast'
import type { ToastFunction } from 'find-compatible-version'
import { setToastFunction } from 'find-compatible-version'

const Toast: React.FC = () => {
  const toastFn: ToastFunction = {
    success: (message: string) => toast.success(message),
    warn: (message: string) => toast(message),
    info: (message: string) => toast(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
  }

  useEffect(() => {
    setToastFunction(toastFn)
  }, [])

  return (
    <Toaster>
      {t => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

export default Toast
