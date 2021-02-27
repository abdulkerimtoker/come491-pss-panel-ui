import {SecurityActions} from "../actions/security";

export const hasLoggedIn = (state = false, action) => {
    switch (action.type) {
        case SecurityActions.SUCCESS_LOG_IN:
            return true;
        case SecurityActions.SUCCESS_LOG_OUT:
            return false;
        default:
            return state;
    }
};

export const assignedPermissions = (state = [], action) => {
    switch (action.type) {
        case SecurityActions.SUCCESS_RECEIVE_ASSIGNED_PERMISSIONS:
            return action.permissions;
        default:
            return state;
    }
};