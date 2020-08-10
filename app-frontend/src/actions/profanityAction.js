import axios from "axios";
import FormData from 'form-data';

const startLoader = (dispatch,a)=>{
    return dispatch({ type: "START_LOADER" });
}
  
const stopLoader = (dispatch)=>{
    return dispatch({ type: "STOP_LOADER" });
}

const handleResponseErrorCase1 = (data)=>{
  console.log(data);
  if(data && data.code){
    if(data.code === 401 || data.code === 498){
      return window.location.replace('/');
    }
  }
}

export const checkProfanity = (message) => dispatch => {
    
    var data = new FormData();
    data.append('text', message);
    data.append('lang', 'en');
    data.append('mode', 'standard');
    data.append('api_user', 1923626804);
    data.append('api_secret', 'zK4YJa82h6wzAQyRo3sT');
    
    var requestObj = {
        url: 'https://api.sightengine.com/1.0/text/check.json',
        method:'post',
        data: data,
        //   headers: data.getHeaders()
    };
    // startLoader(dispatch,1);
    return axios(requestObj).then( (response) => {
        console.log(response.data);
        // stopLoader(dispatch);
        if (response.data && response.data.status) {
            console.log("hlo test");
            if (response.data.profanity && response.data.profanity.matches && response.data.profanity.matches.length > 0) {
                dispatch({
                    type: "SHOW_NOTIFY", payload: {
                      type: 'warning',
                      message: "Warning: Don't use offensive words",
                      dispatch: dispatch
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
        console.log(err);
        if (err.response) {
            err_msg = err.response.data;
        } else { 
            err_msg = err.message;
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
//   var requestObj = {
//     method: 'POST',
//     data: {
//         name : data.name ,
//         groupname : data.groupname
//     },
//     url: API_ENDPOINT + '/user/joingrp',
//   };
//   startLoader(dispatch,1);
  
//   return axios(requestObj).then((response) => {
//     stopLoader(dispatch);
//     if (response && response.data.success && response.data) {
//       cookies.set('a_id', response.data.data.aid,{ path: '/' }); 
//       return response;
//     } else {
//       return dispatch({
//         type: "SHOW_NOTIFY", payload: {
//           type: 'error',
//           message: "Something went wrong",
//           dispatch: dispatch
//         }
//       });
//     }
//   })
//   .catch((err) => {
//     var err_msg = "Something went wrong";
//     if (err.response && err.response.statusText) {
//       err_msg = err.response.statusText;
//     }
//     if(err.response && err.response.data && err.response.data.err){
//       err_msg = err.response.data.err;
//     }
//     if(err && err.response && err.response.data){
//       handleResponseErrorCase1(err.response.data || {})
//     }
//     stopLoader(dispatch);
//     return dispatch({
//       type: "SHOW_NOTIFY", payload: {
//         type: 'error',
//         message: err_msg,
//         dispatch: dispatch
//       }
//     });
//   })
}

