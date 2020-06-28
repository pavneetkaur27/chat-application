


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


export const joinSocket = (socket,data) => dispatch => {
    socket.emit('joingroup', (data) , (resp) => {
        if(resp.err){
            var err_msg = "Something went wrong";
           
            if(resp.err.err){
              err_msg = resp.err.err;
            }
            return dispatch({
              type: "SHOW_NOTIFY", payload: {
                type: 'error',
                message: err_msg,
                dispatch: dispatch
              }
            });
        }
    });
}
  

export const sendMessage = (socket, data) => dispatch =>{
    return new Promise( (resolve, reject) =>{
        if(data.msg && data.msg !== ''){
            socket.emit('newmessage', data , (resp) =>{
                if(resp.success){
                    resolve(resp);
                }else if(resp.err){
                  
                    var err_msg = "Something went wrong";
                   
                    if(resp.err.err){
                       err_msg = resp.err.err;
                    }
                    return dispatch({
                      type: "SHOW_NOTIFY", payload: {
                        type: 'error',
                        message: err_msg,
                        dispatch: dispatch
                      }
                    });
                }
            })
        }
    })
}



export const messageReceived = (resp) => dispatch =>{
    return new Promise( (resolve, reject) =>{
      console.log(resp.data);
      if(resp.data.success){
        dispatch({
          type: "NEW_MESSAGE", 
          payload: {
            message : resp.data.message
          }
        });
        resolve(true);
      }else if(!resp.data.success){
        var err_msg = "Something went wrong";
               
        if(resp.err.err){
            err_msg = resp.data.err;
        }
        return dispatch({
          type: "SHOW_NOTIFY", payload: {
            type: 'error',
            message: err_msg,
            dispatch: dispatch
          }
        });
      }
    })
}

  
