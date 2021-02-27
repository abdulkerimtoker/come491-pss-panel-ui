import {combineReducers} from "redux";
import {assignedPermissions, hasLoggedIn} from "./security";
import {people, person, personModuleAccess, personPictures} from "./person";
import {alertText, alertVariant} from "./alert";
import {signal, signals, signalSteps} from "./signals";
import {modulePeople, modules, _module} from "./modules";

export default combineReducers({
    hasLoggedIn,
    assignedPermissions,

    people,
    person,
    personPictures,
    personModuleAccess,

    alertText,
    alertVariant,

    signals,
    signal,
    signalSteps,

    modules,
    _module,
    modulePeople
});