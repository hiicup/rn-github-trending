import React from "react"
import {TouchableOpacity} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class ViewHelper {

    static leftBackBtnView(callback){
        return <TouchableOpacity style={{paddingLeft:12,paddingRight:50}} onPress={callback}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color:'white'}}
            />
        </TouchableOpacity>
    }

    static shareView(callback){
        return <TouchableOpacity onPress={callback}>
            <AntDesign
                name={'sharealt'}
                size={24}
                style={{color:'white'}}
            />
        </TouchableOpacity>
    }

    static favoriteView(callback,isFav=false){
        return <TouchableOpacity onPress={callback}>
            <AntDesign
                name={isFav?"star":"staro"}
                size={24}
                style={{color:'white'}}
            />
        </TouchableOpacity>
    }
}