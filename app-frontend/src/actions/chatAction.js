import axios from "axios";
import {API_ENDPOINT} from '../constants';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function logoutOrgUser(){
  cookies.remove("ou_at",{path : "/"});
  return function(dispatch){
    window.location.replace('/');
  }
}


const startLoader = (dispatch,a)=>{
    return dispatch({ type: "START_LOADER" });
}
  
const stopLoader = (dispatch)=>{
    return dispatch({ type: "STOP_LOADER" });
}


export const hideAlert =() => dispatch =>{
  dispatch({
    type: "HIDE_NOTIFY", payload: {}
  });
}

const handleResponseErrorCase1 = (data)=>{
  console.log(data);
  if(data && data.code){
    if(data.code == 401 || data.code == 498){
      return window.location.replace('/');
    }
  }
}


export const joinGroup = (data) => dispatch => {
  
  var requestObj = {
    method: 'POST',
    data: {
        name : data.name ,
        groupname : data.groupname
    },
    url: API_ENDPOINT + '/user/joingrp',
  };
  startLoader(dispatch,1);
  
  return axios(requestObj).then((response) => {
    stopLoader(dispatch);
    if (response && response.data.success && response.data) {
      cookies.set('a_id', response.data.data.aid,{ path: '/' }); 
      return response;
    } else {
      return dispatch({
        type: "SHOW_NOTIFY", payload: {
          type: 'error',
          message: "Something went wrong",
          dispatch: dispatch
        }
      });
    }
  })
  .catch((err) => {
    var err_msg = "Something went wrong";
    if (err.response && err.response.statusText) {
      err_msg = err.response.statusText;
    }
    if(err.response && err.response.data && err.response.data.err){
      err_msg = err.response.data.err;
    }
    if(err && err.response && err.response.data){
      handleResponseErrorCase1(err.response.data || {})
    }
    stopLoader(dispatch);
    return dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'error',
        message: err_msg,
        dispatch: dispatch
      }
    });
  })
}


export const fetchChatHistory = (data) => dispatch => {
  
  var requestObj = {
    method: 'POST',
    data: {
       aid : data.aid,
       gid : data.gid,
       lmt : 15,
       tim : data.tim
    },
    url: API_ENDPOINT + '/user/chat_his',
  };
  // startLoader(dispatch,1);
  
  return axios(requestObj).then((response) => {
    // stopLoader(dispatch);
    console.log(response);
    if (response && response.data.success && response.data) {
      let messages = response.data.data.allmessages.reverse();
      if(data.previous_msg){
        dispatch({
          type: "PREVIOUS_MESSAGES", payload: {
            allmessages : messages
          }
         });
      }else{
        dispatch({
          type: "CURRENT_MESSAGES", payload: {
            allmessages : messages
          }
        });
      }
      return response;
    } else {
      return dispatch({
        type: "SHOW_NOTIFY", payload: {
          type: 'error',
          message: "Something went wrong",
          dispatch: dispatch
        }
      });
    }
  })
  .catch((err) => {
    var err_msg = "Something went wrong";
    if (err.response && err.response.statusText) {
      err_msg = err.response.statusText;
    }
    if(err.response && err.response.data && err.response.data.err){
      err_msg = err.response.data.err;
    }
    if(err && err.response && err.response.data){
      handleResponseErrorCase1(err.response.data || {})
    }
    // stopLoader(dispatch);
    return dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'error',
        message: err_msg,
        dispatch: dispatch
      }
    });
  })
}


export const getActiveUser = (data) => dispatch => {
  
  var requestObj = {
    method: 'POST',
    data: {
       aid : data.aid,
       gid : data.gid,
       lmt : 15,
       tim : data.tim
    },
    url: API_ENDPOINT + '/user/chat_his',
  };
  // startLoader(dispatch,1);
  
  return axios(requestObj).then((response) => {
    // stopLoader(dispatch);
    if (response && response.data.success && response.data) {
      let messages = response.data.data.allmessages.reverse();
      if(data.previous_msg){
        dispatch({
          type: "PREVIOUS_MESSAGES", payload: {
            allmessages : messages
          }
         });
      }else{
        dispatch({
          type: "CURRENT_MESSAGES", payload: {
            allmessages : messages
          }
        });
      }
      return response;
    } else {
      return dispatch({
        type: "SHOW_NOTIFY", payload: {
          type: 'error',
          message: "Something went wrong",
          dispatch: dispatch
        }
      });
    }
  })
  .catch((err) => {
    var err_msg = "Something went wrong";
    if (err.response && err.response.statusText) {
      err_msg = err.response.statusText;
    }
    if(err.response && err.response.data && err.response.data.err){
      err_msg = err.response.data.err;
    }
    if(err && err.response && err.response.data){
      handleResponseErrorCase1(err.response.data || {})
    }
    // stopLoader(dispatch);
    return dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'error',
        message: err_msg,
        dispatch: dispatch
      }
    });
  })
}
