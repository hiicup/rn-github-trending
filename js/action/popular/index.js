import Types from "../types"
import DataStore from "../../expend/dao/DataStore"

export function onLoadPopularMoreData(storeName, pageIndex, pageSize, dataArray = [], callback) {
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

                dispatch({
                    type:Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName:storeName,
                    pageIndex: pageIndex,
                    projectModes: dataArray.slice(0,max),
                })

            }
        }, 100);
    }
}


export function onLoadPopularData(storeName, url, pageSize) {
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
                handleData(dispatch, storeName, jsonData, pageSize)
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

function handleData(dispatch, storeName, jsonData, pageSize) {

    let items = [];

    if(jsonData && jsonData.data && jsonData.data.items){
        items = jsonData.data.items;
    }

    dispatch({
        type: Types.POPULAR_LOAD_SUCCESS,
        items:items,
        projectModes: pageSize > items.length?items:items.slice(0,pageSize),
        pageIndex:1,
        storeName,
    })
}