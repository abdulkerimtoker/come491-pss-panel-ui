export const SecurityActions = {
    SUCCESS_LOG_IN: 'SUCCESS_LOG_IN',
    SUCCESS_LOG_OUT: 'SUCCESS_LOG_OUT',

    SUCCESS_RECEIVE_ASSIGNED_PERMISSIONS: 'SUCCESS_RECEIVE_ASSIGNED_PERMISSIONS'
};

export const logIn = () => ({
    type: SecurityActions.SUCCESS_LOG_IN,
});

export const logOut = () => ({
    type: SecurityActions.SUCCESS_LOG_OUT
});

export const receiveAssignedPermissions = permissions => ({
    type: SecurityActions.SUCCESS_RECEIVE_ASSIGNED_PERMISSIONS,
    permissions: permissions
});