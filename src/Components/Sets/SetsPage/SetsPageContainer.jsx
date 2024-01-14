import { connect } from "react-redux";

//Components
import { SetsPage } from "./SetsPage";

//reducers
import {
    createNewSetFailedActionCreator,
    createNewSetRequestActionCreator,
    createNewSetSuccessActionCreator,
    getSetsFailedActionCreator,
    getSetsRequestActionCreator,
    getSetsSuccessActionCreator
} from "../../../redux/setsReducer";

//services
import { setService } from "../../../services/setService";

//helpers
import { Logger } from "../../../utils/logger";
import {getLoggedUserId} from "../../../utils/Helpers";

const MODULE_NAME = 'SetsPage';

const getSets = async (dispatch) => {
    dispatch(getSetsRequestActionCreator());
    try {
        const { data } = await setService.getAllUserSets(getLoggedUserId());
        debugger
        dispatch(getSetsSuccessActionCreator(data))
    } catch(e) {
        dispatch(getSetsFailedActionCreator(e))
    }
}

const getSetsFunc = (dispatch) => () => getSets(dispatch);


const createNewSet = async (dispatch, newSetData) => {
    dispatch(createNewSetRequestActionCreator());
    try {
        await setService.createSet(newSetData, getLoggedUserId());
        dispatch(createNewSetSuccessActionCreator(newSetData))
    } catch (e) {
        debugger
        dispatch(createNewSetFailedActionCreator(e))
        Logger.error(MODULE_NAME, 'handleCreateNewSet', e);
    }
}

const createSetFunc = (dispatch) => (newSetData) => createNewSet(dispatch, newSetData)


const mapStateToProps = (state) => {
    return {
        setsState: state.sets,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateSetsState: getSetsFunc(dispatch),
        createNewSet: createSetFunc(dispatch),
    }
}

const SetsPageContainer = connect(mapStateToProps, mapDispatchToProps)(SetsPage);

export {
    SetsPageContainer,
}
