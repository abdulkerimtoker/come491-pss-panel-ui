import {store} from "./store";
import {logOut} from "./actions/security";

class HttpClient {

    fetch(requestInfo, requestInit = null) {
        if (!requestInit) {
            requestInit = {};
        }
        if (!requestInit['headers']) {
            requestInit['headers'] = {}
        }
        requestInit['headers']['Authorization'] = localStorage.getItem('JWT');
        
        return fetch(requestInfo, requestInit).then(resp => {
            if (resp.status === 403) {
                localStorage.removeItem('JWT');
                store.dispatch(logOut());
            }
            return resp;
        });
    }

}

export default new HttpClient();