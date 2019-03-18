import {AsyncStorage} from "react-native";


const STORE_PREFIX = 'fav_keys_';

export default class FavDao {
    constructor(flag){
        this.storeKey = STORE_PREFIX+flag;
    }

    /**
     * 单个收藏
     * @param key
     * @param value
     */
    addFav(key,value){
        if (typeof value === 'object'){
            value = JSON.stringify(value);
        }
        AsyncStorage.setItem(key,value,(error)=>{
            if(!error){
                this._addKey(key);
            }else{
                console.error(error);
            }
        })
    }

    /**
     * 移除一个收藏
     * @param key
     */
    delFav(key){
        AsyncStorage.removeItem(key,error=>{
            if(!error){
                this._delKey(key);
            }
        })
    }

    getAllFav(){

    }

    /**
     * 判断所有keys中是否存在指定的item
     * @param item
     * @param keys
     * @returns {boolean}
     */
    static has(item,keys){
        if(!keys){
            return false;
        }
        let isHas = false;

        for (let i = 0; i < keys.length; i++) {
            if(FavDao.parseKey(item) === keys[i]){
                isHas = true;
                break;
            }
        }

        return isHas;
    }

    /**
     * 提取项目中的唯一识别码
     * @param item
     * @returns {string}
     */
    static parseKey(item){
        let id = "";
        if(item.id){
            id = item.id.toString();
        }else if(item.fullName){
            return item.fullName.toString();
        }
        return id;
    }

    static onFav(favDao,item,isFav){
        const id = FavDao.parseKey(item);
        console.log("id=",id);
        console.log("isFav=",isFav);
        if(isFav){
            favDao.addFav(id,item);
        }else{
            favDao.delFav(id);
        }
    }

    /**
     * 获取所有的已经收藏的key
     * @returns {Promise<any> | Promise}
     */
    getAllFavKeys(){
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.storeKey,(error,result)=>{
                if(error){
                    reject(error);
                }else{
                    try{
                        if(result){
                            resolve(JSON.parse(result));
                        }else{
                            resolve([]);
                        }
                    }catch (e) {
                        reject(e);
                    }
                }
            })
        });
    }

    _addKey(key){
        this._updateItems(key,'add');
    }

    _delKey(key){
        this._updateItems(key,'del');
    }

    _updateItems(key,action){
        AsyncStorage.getItem(this.storeKey,(error,result)=>{

            if(!error){
                let allKeys = [];
                if(result){
                    allKeys = JSON.parse(result);
                }
                let keyIndex = allKeys.indexOf(key);

                if('add' === action){
                    if(keyIndex === -1){
                        allKeys.push(key);
                    }
                }else if('del' === action){
                    if(keyIndex !== -1){
                        allKeys.splice(keyIndex,1);
                    }
                }

                AsyncStorage.setItem(this.storeKey,JSON.stringify(allKeys))

            }

        })
    }

}