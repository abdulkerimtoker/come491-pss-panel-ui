export const AlertActions = {
    'ALERT': 'ALERT'
};

export const AlertVariants = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SUCCESS: 'success'
};

export const displayAlert = (variant, text) => ({
    type: AlertActions.ALERT,
    variant: variant,
    text: text
});