import Types from "../../action/types"

const defaultState = {};

export default function onAction(state = defaultState,action){
    switch (action.type) {
        case Types.FAV_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items:action.items,
                    projectModes:action.projectModes,
                    isLoading:false
                }
            };
        case Types.FAV_REFRESH:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading:true
                }
            };
        case Types.FAV_LOAD_FAIL:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading:false
                }
            };
        default:
            return state;
    }
}