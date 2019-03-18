import Types from "../types"
import DataStore,{FLAG_TYPE} from "../../expend/dao/DataStore"
import FavDao from "../../expend/dao/FavDao";

export function onLoadTrendingMoreData(storeName, pageIndex, pageSize, dataArray = [], callback,favDao) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback("no data");
                }

                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no data',
                    storeName: storeName,
                    pageIndex: pageIndex,
                    projectModes: dataArray
                })

            }else{
                let max = pageSize*pageIndex > dataArray.length ? dataArray.length:pageSize*pageIndex;
                let showItems = dataArray.slice(0,max);

                wrap(favDao,showItems,projectModes=>dispatch({
                    type:Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName:storeName,
                    pageIndex: pageIndex,
                    projectModes: projectModes,
                }))

            }
        }, 100);
    }
}


export function onLoadTrendingData(storeName, url, pageSize,favDao) {
    return dispatch => {
        // 触发预加载
        dispatch({
            type: Types.TRENDING_REFRESH,
            storeName
        });

        // 远程加载数据
        let store = new DataStore();
        store.fetchData(url,FLAG_TYPE.TRENDING)
            .then(jsonData => {
                handleData(dispatch, storeName, jsonData, pageSize,favDao)
            })
            .catch(error => {
                dispatch({
                    type: Types.TRENDING_LOAD_FAIL,
                    storeName,
                    error
                })
            })
    }
}

function handleData(dispatch, storeName, jsonData, pageSize,favDao) {

    let items = [];

    if(jsonData && jsonData.data){
        items = jsonData.data;
    }

    let showItems = pageSize > items.length?items:items.slice(0,pageSize);

    wrap(favDao,showItems,projectModes=>{
        dispatch({
            type: Types.TRENDING_LOAD_SUCCESS,
            items:items,
            projectModes: projectModes,
            pageIndex:1,
            storeName,
        })
    });


}

class Item {
    constructor(item,isFav){
        this.item = item;
        this.isFav = isFav;
    }
}
async function wrap(favDao,items,callback){
    let favKeys = [];
    try{
        favKeys = await favDao.getAllFavKeys();
    }catch (e) {
        console.log(e);
    }

    console.log("已收藏：",favKeys);

    let newItems = [];

    items.forEach((current)=>{
        newItems.push(new Item(current,FavDao.has(current,favKeys)))
    });

    callback(newItems);
}