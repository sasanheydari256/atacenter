import { DeviceEventEmitter } from "react-native";
import { myStore as store } from "./App";
import { setConfigs,setRequest,removeRequest,setTempState } from "./redux/actions/index";
import { request } from "./service";
import Pushe from 'react-native-pushe';
import R from "reactotron-react-native";
const _ = require("lodash");

export const init = ()=>{
    Pushe.initialize(true);
    Pushe.getPusheId(savePID);
    DeviceEventEmitter.addListener('NewMessage',e => routing(JSON.parse(e)));
}

export const savePID = (newPID)=>{
    const { PID,UserId } = store.getState().configs
    R.log(newPID)
    if(newPID != PID){
        request("POST","/api/jsonCreateServicePid",{ serviseid:UserId,PID:newPID },
            ()=>{},
            ()=>{
                store.dispatch(setConfigs({ PID:newPID }));
            },
            ()=>{}
        )
    }
}

export const routing = (json)=>{
    R.log(json);
    const data = _.omit(json,["Type","types"])
    switch (json.Type) {
        case "NEW_REQUEST":
            store.dispatch(setRequest(data))
            break;
        case "CANCEL_REQUEST":
            store.dispatch(removeRequest(data.RequestId));
            const tempState = store.getState().tempState 
            if(tempState && tempState.activeRequest && tempState.activeRequest.RequestId == data.RequestId){
                store.dispatch(setTempState({state:"activeRequest",value:null}))
            }
            break;
        default:
            break;
    }
}