import http from './httpService';
import { apiUrl } from "../config";
import { Logger } from "../utils/logger";

const MODULE_NAME = 'wordService';

const getBasicApiEndpoint = (userId, setId) => `${apiUrl}/users/${userId}/sets/${setId}`;
const getTrainingEndpoint = (userId, setId, trainingKey) => `${getBasicApiEndpoint(userId, setId)}/training/${trainingKey}`;

const headers = {
    "Content-Type": "application/json",
};

const getAllSetWords = (userId, setId) => {
    return http.get(`${getBasicApiEndpoint(userId, setId)}/words`)
        .then(words => {
            Logger.info(MODULE_NAME, 'getAllSetWords', words);
            return words;
        })
        .catch(error => {
            Logger.error(MODULE_NAME, 'getAllSetWords', error);
            throw error;
        });
};

const createWord = ({ userId, setId, body }) => {
    return http.post(`${getBasicApiEndpoint(userId, setId)}/words`, body, { headers })
        .catch(error => Logger.error(MODULE_NAME, 'createWord', error));
}

const updateWord = ({ userId, setId, body }) => {
    return http.put(`${getBasicApiEndpoint(userId, setId)}/word`, body, { headers })
        .catch(error => Logger.error(MODULE_NAME, 'updateWord', error));
}

const resetWordsProgress = ({ userId, setId }) => {
    return http.put(`${getBasicApiEndpoint(userId, setId)}/words/reset`, {}, { headers })
        .catch(error => Logger.error(MODULE_NAME, 'updateWord', error));
}

const deleteWord = ({ userId, setId, wordId }) => {
    return http.delete(`${getBasicApiEndpoint(userId, setId)}/words/${wordId}`);
}

const startTrainingRound = ({ userId, setId, trainingKey }) => {
    return http.post(`${getTrainingEndpoint(userId, setId, trainingKey)}/start`, {});
}

const previewTrainingRound = ({ userId, setId, trainingKey }) => {
    return http.get(`${getTrainingEndpoint(userId, setId, trainingKey)}/preview`);
}

const submitTrainingAnswer = ({ userId, setId, wordId, trainingKey, round, correct }) => {
    return http.put(`${getTrainingEndpoint(userId, setId, trainingKey)}/words/${wordId}`, { round, correct });
}

const wordService = {
    getAllSetWords,
    createWord,
    updateWord,
    deleteWord,
    resetWordsProgress,
    startTrainingRound,
    previewTrainingRound,
    submitTrainingAnswer,
}

export {
    wordService,
};
