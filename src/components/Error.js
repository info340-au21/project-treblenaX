import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

/**
 * Returns a Snackbar component given an error message
 * props:
 * - msg: string
 */
export default function Error(props) {
    const [open, setOpen] = useState(true);
    const [errorMessage, setErrorMessage] = useState(props.msg);
    const handleClose = () => setOpen(false);
    return (
        <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={open}
            autoHideDuration={10000}
            onClose={handleClose}
            message={errorMessage}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
        </Snackbar>
    );
}