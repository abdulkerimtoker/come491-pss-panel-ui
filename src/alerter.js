import {store} from "./store";
import {displayAlert} from "./actions/alert";

export const showAlert = (variant, text) => {
    store.dispatch(displayAlert(variant, text))
};