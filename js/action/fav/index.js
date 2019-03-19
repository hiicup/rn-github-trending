import Types from "../types"
import {Item} from "../trending/index";
import FavDao from "../../expend/dao/FavDao";


export function createActionLoadData(storeName){
    return dispatch=>{
        dispatch({
            type:Types.FAV_REFRESH,
            storeName
        });

        // 加载数据
        new FavDao(storeName).getAllFav().then(allItems=>{

            let items = [];
            if(allItems){
                items = allItems;
            }
            //
            const projectModes = items.map((current,index,arr)=>{
                return new Item(current,true);
            });

            dispatch({
                type:Types.FAV_LOAD_SUCCESS,
                projectModes:projectModes,
                storeName
            });

        }).catch(error=>{
            dispatch({
                type:Types.FAV_LOAD_FAIL,
                storeName,
                error
            });
        })

    }
}