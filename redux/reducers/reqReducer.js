import {
  FETCHING_REQUEST,
  FETCHING_SUCCESS,
  FETCHING_FAILUR
} from '../actions/type';
import {
    SET_REQUEST,REMOVE_REQUEST,CLEAR_REQUEST,SET_REQUESTS
} from "../actions/type";
const filter = require("lodash/filter");

import {
    SET_TEMP_STATE, SET_TEMP_STATE_REQUEST, REMOVE_TEMP_STATE_REQUEST
} from "../actions/type";

const initialState = {
  isFetching:false,
  error:'',
  requests:[]
};
// این قسمت برای دریافت درخواست ها و ارسال به state 
export const reqData = (state = initialState , action)=>{
  switch(action.type){
    case FETCHING_REQUEST:
      return { ...state,isFetching:true};
    case FETCHING_FAILUR:
      return { ...state,isFetching:false, errorMessage: action.payload};
    case FETCHING_SUCCESS:
      return { ...state, isFetching:false , requests: action.payload };
    default:
      return state;
  }
};



export const requests = (state = [] , action = {}) => {
    switch (action.type) {
        case SET_REQUESTS:
            return [..._.uniqBy([...state,...action.value],r=> r.RequestId)]

        case SET_REQUEST:
            return [ action.value,...state ]

        case REMOVE_REQUEST:
            return [ ...filter(state,r=> r.RequestId != action.value) ]

        case CLEAR_REQUEST:
            return []

        default:
            return state;
    }
};


export const tempState = (state = { requests:[],activeRequest:null,rate:null } , action = {}) => {
    switch (action.type) {
        case SET_TEMP_STATE:
            return {
                ...state,
                [action.state]:action.value
            }
            break;
        case SET_TEMP_STATE_REQUEST:
            return {
                ...state,
                requests:[...state.requests,action.value]
            }
            break;
        case REMOVE_TEMP_STATE_REQUEST:
          state.requests.splice(0,1)
          return {
            ...state,
            request:[...state.requests]
          }
        default:
            return state;
    }
}


// export default peopleReducer;
