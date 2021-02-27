export const SignalActions = {
    SUCCESS_RECEIVE_SIGNALS: 'SUCCESS_RECEIVE_SIGNALS',
    SUCCESS_RECEIVE_SIGNAL: 'SUCCESS_RECEIVE_SIGNAL',
    SUCCESS_RECEIVE_SIGNAL_STEPS: 'SUCCESS_RECEIVE_SIGNAL_STEPS'
};

export const receiveSignals = signals => ({
    type: SignalActions.SUCCESS_RECEIVE_SIGNALS,
    signals: signals
});

export const receiveSignal = signal => ({
    type: SignalActions.SUCCESS_RECEIVE_SIGNAL,
    signal: signal
});

export const receiveSignalSteps = steps => ({
    type: SignalActions.SUCCESS_RECEIVE_SIGNAL_STEPS,
    steps: steps
});
