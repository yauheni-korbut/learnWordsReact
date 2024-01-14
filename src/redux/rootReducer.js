import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { setsReducer } from "./setsReducer";
import { wordsReducer } from "./wordsReducer";
import { trainingReducer } from "./trainingReducer";


const rootReducer = combineReducers({
    user: userReducer,
    sets: setsReducer,
    words: wordsReducer,
    trainings: trainingReducer,
})

export {
    rootReducer,
}
