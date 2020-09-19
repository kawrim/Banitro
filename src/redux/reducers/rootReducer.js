import {combineReducers} from "redux";
import logReducer from "./logReducer";
import utilsReducer from "./utilsReducer";



const rootReducer= combineReducers({
    log:logReducer,
    utils:utilsReducer
})
export default rootReducer;
