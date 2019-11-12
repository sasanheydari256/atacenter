import {
    SET_CONFIGS, RESET_CONFIG,
    SET_TEMP_STATE,SET_TEMP_STATE_REQUEST,REMOVE_TEMP_STATE_REQUEST,
    SET_REQUEST,SET_REQUESTS,REMOVE_REQUEST,CLEAR_REQUEST
} from "./type";


export const setConfigs = configs => ({
    type : SET_CONFIGS,
    configs
});

export const resetConfigs = () => ({
    type : RESET_CONFIG,
});

export const setTempState = ({state,value})=>({
    type:SET_TEMP_STATE,
    state,
    value
});

export const setTempStateRequest = (value)=>({
    type:SET_TEMP_STATE_REQUEST,
    value
});

export const removeTempStateRequest = (value)=>({
    type:REMOVE_TEMP_STATE_REQUEST,
    value
});

export const setRequests = (value)=>({
    type:SET_REQUESTS,
    value
});

export const setRequest = (value)=>({
    type:SET_REQUEST,
    value
});

export const removeRequest = (value)=>({
    type:REMOVE_REQUEST,
    value
});

export const clearRequest = ()=>({
    type:CLEAR_REQUEST
});