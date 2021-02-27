import {ModuleActions} from "../actions/module";

export const modules = (state = [], action) => {
    switch (action.type) {
        case ModuleActions.SUCCESS_RECEIVE_MODULES:
            return action.modules;
        default:
            return state;
    }
};

export const _module = (state = null, action) => {
    switch (action.type) {
        case ModuleActions.SUCCESS_RECEIVE_MODULE:
            return action._module;
        default:
            return state;
    }
};

export const modulePeople = (state = null, action) => {
    switch (action.type) {
        case ModuleActions.SUCCESS_RECEIVE_MODULE_PEOPLE:
            return action.people;
        default:
            return state;
    }
};