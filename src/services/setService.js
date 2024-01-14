import http from './httpService';
import { apiUrl } from "../config";
import { Logger } from "../utils/logger";

const MODULE_NAME = 'setService';

const getBasicApiEndpoint = (userId) => `${apiUrl}/users/${userId}`;

const headers = {
    "Content-Type": "application/json",
};

const getAllUserSets = (userId) => {
    return http.get(`${getBasicApiEndpoint(userId)}/sets`)
        .then(sets => {
            Logger.info(MODULE_NAME, 'getAllUserSets', sets);
            return sets;
        })
        .catch(error => Logger.error(MODULE_NAME, 'getAllUserSets', error));
};

const createSet = (newSetData, userId) => {
    debugger
    const body = {
        name: newSetData.title,
        locale: newSetData.locale,
    }
    return http.post(`${getBasicApiEndpoint(userId)}/set`, body, { headers })
        .catch(error => Logger.error(MODULE_NAME, 'createSet', error));
}

const updateSet = (newSetData, userId, setId) => {
    debugger
    const body = {
        id: setId,
    };
    if (newSetData.title){
        body.name = newSetData.title;
    }
    if (newSetData.locale) {
        body.locale = newSetData.locale;
    }
    return http.put(`${getBasicApiEndpoint(userId)}/set`, body, { headers })
        .catch(error => Logger.error(MODULE_NAME, 'createSet', error));
}

const deleteSet = (userId, setId) => {
    return http.delete(`${getBasicApiEndpoint(userId)}/sets/${setId}`);
}

const setService = {
    getAllUserSets,
    createSet,
    deleteSet,
    updateSet,
}

export {
    setService,
};
