export const ModuleActions = {
    SUCCESS_RECEIVE_MODULES: 'SUCCESS_RECEIVE_MODULES',
    SUCCESS_RECEIVE_MODULE: 'SUCCESS_RECEIVE_MODULE',
    SUCCESS_RECEIVE_MODULE_PEOPLE: 'SUCCESS_RECEIVE_MODULE_PEOPLE'
};

export const receiveModules = modules => ({
    type: ModuleActions.SUCCESS_RECEIVE_MODULES,
    modules: modules
});

export const receiveModule = _module => ({
    type: ModuleActions.SUCCESS_RECEIVE_MODULE,
    _module: _module
});

export const receiveModulePeople = people => ({
    type: ModuleActions.SUCCESS_RECEIVE_MODULE_PEOPLE,
    people: people
});