const GET_SETS_REQUEST = 'GET_SETS_REQUEST';
const GET_SETS_SUCCESS = 'GET_SETS_SUCCESS';
const GET_SETS_FAILED = 'GET_SETS_FAILED';

const CREATE_NEW_SET_REQUEST = 'CREATE_NEW_SET_REQUEST';
const CREATE_NEW_SET_SUCCESS = 'CREATE_NEW_SET_SUCCESS';
const CREATE_NEW_SET_FAILED = 'CREATE_NEW_SET_FAILED';

const MERGE_SETS_REQUEST = 'CREATE_NEW_SET_REQUEST';
const MERGE_SETS_SUCCESS = 'CREATE_NEW_SET_SUCCESS';
const MERGE_SETS_FAILED = 'CREATE_NEW_SET_FAILED';

let initialState = {
    setsData: [],
    getSetsRequestState: {
        isLoading: null,
        isSuccess: null,
        isFailed: null,
    },
    createNewSetRequestState: {
        isLoading: null,
        isSuccess: null,
        isFailed: null,
    },
    mergeSetsRequestState: {
        isLoading: null,
        isSuccess: null,
        isFailed: null,
    }
}

const setsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SETS_REQUEST:
            return {
                ...state,
                getSetsRequestState: {
                    isLoading: true,
                    isSuccess: null,
                    isFailed: null,
                }
            }
        case GET_SETS_SUCCESS:
            return {
                ...state,
                setsData: action.setsData,
                getSetsRequestState: {
                    isLoading: null,
                    isSuccess: true,
                    isFailed: null,
                }
            }
        case GET_SETS_FAILED:
            return {
                ...state,
                getSetsRequestState: {
                    isLoading: null,
                    isSuccess: null,
                    isFailed: true,
                }
            }
        case CREATE_NEW_SET_REQUEST:
            return {
                ...state,
                createNewSetRequestState: {
                    isLoading: true,
                    isSuccess: null,
                    isFailed: null,
                }
            };
        case CREATE_NEW_SET_SUCCESS:
            return {
                ...state,
                createNewSetRequestState: {
                    isLoading: null,
                    isSuccess: true,
                    isFailed: null,
                }
            };
        case CREATE_NEW_SET_FAILED:
            return {
                ...state,
                createNewSetRequestState: {
                    isLoading: null,
                    isSuccess: null,
                    isFailed: true,
                }
            };
        case MERGE_SETS_REQUEST:
            return {
                ...state,
                mergeSetsRequestState: {
                    isLoading: true,
                    isSuccess: null,
                    isFailed: null,
                }
            };
        case MERGE_SETS_SUCCESS:
            return {
                ...state,
                mergeSetsRequestState: {
                    isLoading: null,
                    isSuccess: true,
                    isFailed: null,
                }
            };
        case MERGE_SETS_FAILED:
            return {
                ...state,
                mergeSetsRequestState: {
                    isLoading: null,
                    isSuccess: null,
                    isFailed: true,
                }
            }
        default:
            return state;
    }
}

const getSetsRequestActionCreator = () => ({ type: GET_SETS_REQUEST });
const getSetsSuccessActionCreator = (setsData) => ({ type: GET_SETS_SUCCESS, setsData });
const getSetsFailedActionCreator = (error) => ({ type: GET_SETS_REQUEST, error });

const createNewSetRequestActionCreator = () => ({ type: CREATE_NEW_SET_REQUEST });
const createNewSetSuccessActionCreator = (newSetData) => ({ type: CREATE_NEW_SET_SUCCESS, newSetData });
const createNewSetFailedActionCreator = (error) => ({ type: CREATE_NEW_SET_FAILED, error });

const mergeSetsRequestActionCreator = () => ({ type: CREATE_NEW_SET_REQUEST });
const mergeSetsSuccessActionCreator = (setsIds) => ({ type: CREATE_NEW_SET_SUCCESS, setsIds }); //title, locale
const mergeSetsFailedActionCreator = (error) => ({ type: CREATE_NEW_SET_FAILED, error });

export {
    setsReducer,
    getSetsRequestActionCreator,
    getSetsSuccessActionCreator,
    getSetsFailedActionCreator,
    createNewSetRequestActionCreator,
    createNewSetSuccessActionCreator,
    createNewSetFailedActionCreator,
    mergeSetsRequestActionCreator,
    mergeSetsSuccessActionCreator,
    mergeSetsFailedActionCreator
}
