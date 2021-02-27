export const PersonActions = {
    SUCCESS_RECEIVE_PEOPLE: 'SUCCESS_RECEIVE_PEOPLE',
    SUCCESS_RECEIVE_PERSON: 'SUCCESS_RECEIVE_PERSON',
    SUCCESS_RECEIVE_PERSON_PICTURES: 'SUCCESS_RECEIVE_PERSON_PICTURES',
    SUCCESS_RECEIVE_PERSON_MODULE_ACCESS: 'SUCCESS_RECEIVE_PERSON_MODULE_ACCESS',
};

export const receivePeople = people => ({
    type: PersonActions.SUCCESS_RECEIVE_PEOPLE,
    people: people
});

export const receivePerson = person => ({
    type: PersonActions.SUCCESS_RECEIVE_PERSON,
    person: person
});

export const receivePersonPictures = pictures => ({
    type: PersonActions.SUCCESS_RECEIVE_PERSON_PICTURES,
    pictures: pictures
});

export const receivePersonModuleAccess = moduleAccess => ({
    type: PersonActions.SUCCESS_RECEIVE_PERSON_MODULE_ACCESS,
    moduleAccess: moduleAccess
});