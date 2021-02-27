import {AlertActions} from "../actions/alert";

export const alertText = (state = null, action) => {
    switch (action.type) {
        case AlertActions.ALERT:
            return action.text;
        default:
            return state;
    }
};

export const alertVariant = (state = null, action) => {
    switch (action.type) {
        case AlertActions.ALERT:
            return action.variant;
        default:
            return state;
    }
};