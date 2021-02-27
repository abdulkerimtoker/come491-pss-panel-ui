import {SignalActions} from "../actions/signals";

export const signals = (state = [], action) => {
    switch (action.type) {
        case SignalActions.SUCCESS_RECEIVE_SIGNALS:
            return action.signals;
        default:
            return state;
    }
};

export const signal = (state = null, action) => {
    switch (action.type) {
        case SignalActions.SUCCESS_RECEIVE_SIGNAL:
            return action.signal;
        default:
            return state;
    }
};

export const signalSteps = (state = null, action) => {
    switch (action.type) {
        case SignalActions.SUCCESS_RECEIVE_SIGNAL_STEPS:
            return action.steps;
        default:
            return state;
    }
};