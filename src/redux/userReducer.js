import { currentUserKey } from "../services/serviceConstants";

const GET_USER_FROM_LOCAL_STORAGE = 'GET_USER_FROM_LOCAL_STORAGE';
const LOGOUT_USER = 'LOGOUT_USER';
const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
const LOGIN_USER_FAILED = 'LOGIN_USER_FAILED';

const loggedUser = JSON.parse(localStorage.getItem(currentUserKey));

const initialState = {
    loginUserState: {
        isLoading: null,
        isSuccess: null,
        isFailed: null,
    },
    id: loggedUser?.id || '',
    login: loggedUser?.login || '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_FROM_LOCAL_STORAGE:
            const loggedUser = JSON.parse(localStorage.getItem(currentUserKey));
            return {
                ...state,
                id: loggedUser?.id || state.id,
                login: loggedUser?.login || state.id,
            };
        case LOGIN_USER_REQUEST:
            return {
                ...state,
                loginUserState: {
                    isLoading: true,
                    isSuccess: null,
                    isFailed: null,
                }
            }
            case LOGIN_USER_SUCCESS:
                return {
                    ...state,
                    loginUserState: {
                        isLoading: null,
                        isSuccess: true,
                        isFailed: null,
                    },
                    id: action.userData.id,
                    login: action.userData.login,
                }
        case LOGIN_USER_FAILED:
            const error = action.error;
            return {
                ...state,
                loginUserState: {
                    isLoading: null,
                    isSuccess: null,
                    isFailed: true,
                }
            }
        case LOGOUT_USER:
            localStorage.removeItem(currentUserKey)
            return {
                ...state,
                id: '',
                login: '',
            }
        default:
            return state;
    }
}

const getUserFromLocalStorageActionCreator = () => ({ type: GET_USER_FROM_LOCAL_STORAGE });

const loginUserRequestActionCreator = () => ({ type: LOGIN_USER_REQUEST });
const loginUserSuccessActionCreator = (userData) => ({ type: LOGIN_USER_SUCCESS, userData });
const loginUserFailedActionCreator = (error) => ({ type: LOGIN_USER_FAILED, error });

const logOutUserActionCreator = () => ({ type: LOGOUT_USER });

export {
    userReducer,
    getUserFromLocalStorageActionCreator,
    loginUserRequestActionCreator,
    loginUserSuccessActionCreator,
    loginUserFailedActionCreator,
    logOutUserActionCreator,
}
