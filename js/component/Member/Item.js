import React,{Component} from "react"
import {TouchableOpacity,View,Text,StyleSheet} from "react-native"
import PropTyps from "prop-types"

import {RightArrow} from "../Icon"

export default class Item extends Component{

    static defaultProps = {
        name:"未知",
    };

    static propTypes = {
        name:PropTyps.string,
        onClick:PropTyps.func,
        Icon:PropTyps.func,
        iconName:PropTyps.string,
        color:PropTyps.string,
        menu:PropTyps.object,
    };

    onClick(){
        const {menu,onClick} = this.props;
        if(menu && onClick){
            onClick(menu);
        }
    }

    render(){
        const {name,Icon,iconName,color,menu} = this.props;

        let name_ = name;
        let Icon_ = Icon;
        let iconName_ = iconName;

        if(menu){
            name_ = menu.name;
            Icon_ = menu.Icons;
            iconName_ = menu.icon;
        }

        const iconView = Icon_ && iconName_?<Icon_ style={{color:color,marginRight:10}} name={iconName_} size={16} />:null;
        return <TouchableOpacity style={styles.item} onPress={()=>this.onClick()}>
            <View style={styles.itemLeft}>
                {iconView}
                <Text>{name_}</Text>
            </View>
            <RightArrow/>
        </TouchableOpacity>
    }

}

const styles = StyleSheet.create({
    item:{
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:10,
        height:60,
    },
    itemLeft:{
        flexDirection: 'row',
        alignItems:'center'
    }
});