import React, { useEffect, useState } from 'react'
import type { SnackbarCloseReason } from '@mui/material'
import { AlertTitle, Alert as MuiAlert, Snackbar } from '@mui/material'
import type { ToastFunction } from 'find-compatible-version'
import { setToastFunction } from 'find-compatible-version'

type SeverityType = 'success' | 'warning' | 'info' | 'error'

const Alert = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="outlined" {...props} />
))

const Toast: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [severity, setSeverity] = useState<SeverityType>('info')

  const notify = (msg: string, severity: SeverityType) => {
    setMessage(msg)
    setSeverity(severity)
    setOpen(true)
  }

  const toastFn: ToastFunction = {
    success: (message: string) => notify(message, 'success'),
    warn: (message: string) => notify(message, 'warning'),
    info: (message: string) => notify(message, 'info'),
    error: (message: string) => notify(message, 'error'),
  }

  useEffect(() => {
    setToastFunction(toastFn)
  }, [])

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        <AlertTitle sx={{ textTransform: 'capitalize' }}>{severity}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast
