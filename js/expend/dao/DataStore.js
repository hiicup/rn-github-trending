import {AsyncStorage} from "react-native"

import TrendingFetch from "GitHubTrending"

export const FLAG_TYPE = {
    POPULAR: 'POPULAR',
    TRENDING: 'TRENDING'
};

export default class DataStore {

    removeData(url, callback) {
        if (!url) return;
        AsyncStorage.removeItem(url, callback);
    }

    /**
     * 获取数据，带本地缓存，4小时有效期
     * @param url
     * @param flag
     * @returns {Promise<any> | Promise}
     */
    fetchData(url, flag = FLAG_TYPE.POPULAR) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then(jsonData => {
                if (jsonData && DataStore.checkTimestampValid(jsonData.timestamp)) {
                    console.log("本地数据有效，返回本地数据");
                    resolve(jsonData);
                } else {
                    console.log("本地数据过期，从网络获取");
                    this.fetchNetData(url, flag).then(jsonData => {
                        resolve(this._wrapData(jsonData));
                    }).catch(error => {
                        reject(error);
                        console.error(error);
                    })
                }
            }).catch(error => {
                console.log("本地数据异常，从网络获取", error);
                this.fetchNetData(url, flag).then(jsonData => {
                    resolve(this._wrapData(jsonData));
                }).catch(error => {
                    reject(error);
                    console.error(error);
                })
            })
        });
    }

    /**
     * 将key字段的值设置成value(注意 value 必须是字符串值，非字符串数据必须先序列化为字符串)，
     * 并在完成后调用callback函数。如果有任何错误发生，则会传递一个Error对象作为第一个参数。返回一个Promise对象。
     * @param url
     * @param data
     * @param callback
     */
    saveData(url, data, callback) {
        if (!url || !data) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    /**
     * 从网路读取数据
     * @param url
     * @param flag
     * @returns {Promise<any> | Promise}
     */
    fetchNetData(url, flag) {
        return new Promise((resolve, reject) => {
            if (flag === FLAG_TYPE.POPULAR) {
                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error("Network response was not ok.");
                    })
                    .then(json => {
                        // 存储到本地
                        this.saveData(url, json);
                        resolve(json);
                    })
                    .catch(error => {
                        reject(error);
                    })
            } else {
                console.log("开始获取", url, flag);
                new TrendingFetch().fetchTrending(url)
                    .then((items) => {
                        this.saveData(url, items);
                        console.log("获取网络数据", items);
                        resolve(items);
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });
    }

    /**
     * 从本地读取数据
     * @param url
     * @returns {Promise<any> | Promise}
     */
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            /**
             * 读取key字段并将结果作为第二个参数传递给callback。如果有任何错误发生，则会传递一个Error对象作为第一个参数。返回一个Promise对象。
             */
            AsyncStorage.getItem(url, (error, result) => {
                if (error) {
                    reject(error);
                    console.error(error);
                } else {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                }
            })
        });
    }


    static checkTimestampValid(timestamp) {
        const nowDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (nowDate.getMonth() !== targetDate.getMonth()) return false;
        if (nowDate.getDate() !== targetDate.getDate()) return false;

        // return nowDate.getHours() - targetDate.getHours() > 4;
        return nowDate.getMinutes() - targetDate.getMinutes() < 1
    }

    _wrapData(data) {
        return {
            data: data,
            timestamp: new Date().getTime()
        }
    }

}