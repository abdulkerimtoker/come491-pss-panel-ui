import {PersonActions} from "../actions/person";

export const people = (state = [], action) => {
    switch (action.type) {
        case PersonActions.SUCCESS_RECEIVE_PEOPLE:
            return action.people;
        default:
            return state;
    }
};

export const person = (state = null, action) => {
    switch (action.type) {
        case PersonActions.SUCCESS_RECEIVE_PERSON:
            return action.person;
        default:
            return state;
    }
};

export const personPictures = (state = null, action) => {
    switch (action.type) {
        case PersonActions.SUCCESS_RECEIVE_PERSON_PICTURES:
            return action.pictures;
        default:
            return state;
    }
};

export const personModuleAccess = (state = null, action) => {
    switch (action.type) {
        case PersonActions.SUCCESS_RECEIVE_PERSON_MODULE_ACCESS:
            return action.moduleAccess;
        default:
            return state;
    }
};
