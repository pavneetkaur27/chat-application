const initialState = {
    loading     : false,
}

export default function (state = initialState, action) {
    switch (action.type) {

        case 'START_LOADER' : {
            return {...state,
                loading : true
            }
        }
        
        case 'STOP_LOADER' : {
            return {...state,
                loading : false
            }
        }

        case "SHOW_NOTIFY": {
            return {
                ...state,
                data: {
                    type: action.payload.type,
                    show: true,
                    message: action.payload.message
                }
            }
        }

        case "HIDE_NOTIFY": {
            return {
                ...state,
                data: {
                    show: false,
                }
            }
        }

        case "CURRENT_MESSAGES":
            return {
                ...state,
                allmessages : action.payload.allmessages,
            }

        case "PREVIOUS_MESSAGES":
            return {
                ...state,
                allmessages : action.payload.allmessages.concat(state.allmessages),
            }

        case "NEW_MESSAGE":
            return {
                ...state,
                allmessages : state.allmessages.concat(action.payload.message),
            }
        
        case "ACTIVE_USERS":
            return {
                ...state,
                activeusers : action.payload.activeusers,
            }
        

        default:
            return state;
    }
}