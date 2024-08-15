import React, { useState, useEffect } from 'react';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { ToastFunction, setToastFunction } from 'find-compatible-version';

type SeverityType = 'success' | 'warning' | 'info' | 'error';

const Alert = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<SeverityType>('info');

    const toastFn: ToastFunction = {
        success: (message: string) => {
            notify(message, 'success');
        },
        warn: (message: string) => {
            notify(message, 'warning');
        },
        info: (message: string) => {
            notify(message, 'info');
        },
        error: (message: string) => {
            notify(message, 'error');
        },
    };

    const notify = (msg: string, severity: SeverityType) => {
        setMessage(msg);
        setSeverity(severity);
        setOpen(true);
    };

    useEffect(() => {
        setToastFunction(toastFn);
    }, []);

    return (
        <Snackbar open={open} onClose={() => setOpen(false)}>
            <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;