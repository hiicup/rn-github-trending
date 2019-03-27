import {AsyncStorage} from "react-native"

import languages from "../../res/languages"
import keys from "../../res/keys"

// 用于区别是保存语言，还是保存key
export const TARGET = {
    lang: "language_dao_lang", key: "language_dao_key"
};
export default class LanguageDao {

    static createLanguageDao() {
        return new LanguageDao(TARGET.lang);
    }

    static createKeyDao() {
        return new LanguageDao(TARGET.key);
    }

    static isLang(flag){
        return flag === TARGET.lang;
    }

    static isKey(flag){
        return flag === TARGET.key;
    }

    constructor(flag) {
        this.flag = flag;
    }

    fetch() {
        return new Promise(((resolve, reject) => {
            AsyncStorage.getItem(this.flag, ((error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    const defaultData = this.getDefaultData();
                    this.save(defaultData);
                    resolve(defaultData);
                } else {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }
            }))
        }));
    }

    getDefaultData() {
        return this.flag === TARGET.lang ? languages : keys;
    }

    save(dataObject) {
        let dataString = JSON.stringify(dataObject);
        AsyncStorage.setItem(this.flag, dataString, error => {
            console.log(error);
        })
    }

}