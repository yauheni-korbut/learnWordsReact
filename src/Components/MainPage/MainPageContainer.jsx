import { connect } from "react-redux";

//Components
import { MainPage } from "./MainPage";

//reducers
import {
    getUserFromLocalStorageActionCreator, loginUserRequestActionCreator,
    loginUserSuccessActionCreator, loginUserFailedActionCreator, logOutUserActionCreator} from "../../redux/userReducer";
import { getSetsFailedActionCreator, getSetsSuccessActionCreator } from "../../redux/setsReducer";

//services
import {userService} from "../../services/userService";
import { setService } from "../../services/setService";

//helpers
import { getLoggedUserId } from "../../utils/Helpers";

//styles
import './MainPage.scss';


const loginUser = async (dispatch, login) => {
    dispatch(loginUserRequestActionCreator());

    try {
        const userData = await userService.login(login);
        dispatch(loginUserSuccessActionCreator(userData));
        try {
            const { data } = await setService.getAllUserSets(getLoggedUserId());
            dispatch(getSetsSuccessActionCreator(data))
        } catch (e) {
            dispatch(getSetsFailedActionCreator(e))
        }
        return userData;
    } catch (e) {
        dispatch(loginUserFailedActionCreator(e));
    }
};
const loginUserFunc = dispatch => login => loginUser(dispatch, login);


const mapStateToProps = (state) => {
    return {
        userState: state.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserFromLocalStorage: () => dispatch(getUserFromLocalStorageActionCreator()),
        loginUser: loginUserFunc(dispatch),
        logoutUser: () => dispatch(logOutUserActionCreator())
    }
}

const MainPageContainer = connect(mapStateToProps, mapDispatchToProps)(MainPage)

export {
    MainPageContainer,
}
