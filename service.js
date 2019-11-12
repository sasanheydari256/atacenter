const _ = require("lodash");
export const BASE_URL = "http://www.tebpasand.ir";
// import { checkInternetConnection } from 'react-native-offline';
import { myStore as store } from "./App";
// import { setTempStateRequest } from "./redux/actions/index";

export const request = async (method, url, data, startCB, successCB, errorCB) => {
     const sendRequest = () => {
        startCB && startCB();

        fetch(BASE_URL + url, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
        })
        .then(response => response.json())
        .then(result => {
            successCB && successCB(result);
        })
        .catch(err => {
            errorCB && errorCB();
        })
    }
    sendRequest();
    // const isConnected = await checkInternetConnection();
    // if(isConnected){
    //   sendRequest();
    // }else{
    //   store.dispatch(setTempStateRequest(sendRequest))
    // }
}


export const postData = async (url = '', data = {})=> {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}
