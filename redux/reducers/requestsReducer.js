// import {
//     SET_REQUEST,REMOVE_REQUEST,CLEAR_REQUEST,SET_REQUESTS
// } from "../actions/type";
// const filter = require("lodash/filter");
//
// export default requests = (state = [] , action = {}) => {
//     switch (action.type) {
//         case SET_REQUESTS:
//             return [..._.uniqBy([...state,...action.value],r=> r.RequestId)]
//
//         case SET_REQUEST:
//             return [ action.value,...state ]
//
//         case REMOVE_REQUEST:
//             return [ ...filter(state,r=> r.RequestId != action.value) ]
//
//         case CLEAR_REQUEST:
//             return []
//
//         default:
//             return state;
//     }
// }
