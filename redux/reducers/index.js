import { combineReducers } from 'redux';
import configs from './configsReducer';
import {requests,reqData,tempState} from "./reqReducer";

const rehydrated = (state = false , action) => {
    switch (action.type) {
        case "persist/REHYDRATE" :
            return true;
            break;
        default:
            return state;
    }
}

export default combineReducers({
    rehydrated,
    tempState,
    configs,
    requests,
    reqData
});
