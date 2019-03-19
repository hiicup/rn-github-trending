import Types from "../types"
import DataStore from "../../expend/dao/DataStore"
import {wrap} from "../trending/index"

export function onLoadPopularMoreData(storeName, pageIndex, pageSize, dataArray = [], callback,favDao) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback("no data");
                }

                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no data',
                    storeName: storeName,
                    pageIndex: pageIndex,
                    projectModes: dataArray
                })

            }else{
                let max = pageSize*pageIndex > dataArray.length ? dataArray.length:pageSize*pageIndex;
                let showItems = dataArray.slice(0,max);

                wrap(favDao,showItems,(projectModes)=>{
                    dispatch({
                        type:Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName:storeName,
                        pageIndex: pageIndex,
                        projectModes: projectModes,
                    })
                })

            }
        }, 100);
    }
}


export function onLoadPopularData(storeName, url, pageSize,favDao) {
    return dispatch => {
        // 触发预加载
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName
        });

        // 远程加载数据
        let store = new DataStore();
        store.fetchData(url)
            .then(jsonData => {
                handleData(dispatch, storeName, jsonData, pageSize,favDao)
            })
            .catch(error => {
                dispatch({
                    type: Types.POPULAR_LOAD_FAIL,
                    storeName,
                    error
                })
            })
    }
}



function handleData(dispatch, storeName, jsonData, pageSize,favDao) {

    let items = [];

    if(jsonData && jsonData.data && jsonData.data.items){
        items = jsonData.data.items;
    }

    let showItems = pageSize > items.length?items:items.slice(0,pageSize);

    wrap(favDao,showItems,(projectModes)=>{
        dispatch({
            type: Types.POPULAR_LOAD_SUCCESS,
            items:items,
            projectModes: projectModes,
            pageIndex:1,
            storeName,
        })
    });
}



