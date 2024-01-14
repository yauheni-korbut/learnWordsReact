import http from './httpService';
import { apiUrl } from "../config";
import { Logger } from "../utils/logger";
import { currentUserKey } from "./serviceConstants";

const MODULE_NAME = 'userService'

//endpoints
const apiEndpoint = `${apiUrl}/user`;
const getEndpointLogin = (login) => `${apiEndpoint}?login=${login}`

const login = (login) => {
    return http.get(getEndpointLogin(login))
        .then(({ data }) => {
            Logger.info(MODULE_NAME, 'login', JSON.stringify(data));
            localStorage.setItem(currentUserKey, JSON.stringify(data));
            return data;
        })
        .catch(error => Logger.error(MODULE_NAME, 'login', JSON.stringify(error)));
}


const userService = {
    login,
}

export {
    userService,
};
