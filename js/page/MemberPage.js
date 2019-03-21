import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView,StatusBar,TouchableOpacity} from 'react-native';

import actions from "../action"
import {connect} from "react-redux"
import NavigationBar from "../common/NavigationBar";

import Ionicons from "react-native-vector-icons/Ionicons"

import {MENU} from "../common/menu"
import Item from "../component/Member/Item"
import Line from "../component/Line"
import {RightArrow} from "../component/Icon"
import NavigationUtil from "../navigator/NavigationUtil";

import Hiicup from "../common/Hiicup";

const WEB_ROUTE_NAME = 'WebPage';
type Props = {};
class MemberPage extends Component<Props> {

    async getApi(){
        const api = await Hiicup.api();
        Hiicup.sayHello(api);
    }

    onClick(menu){
        let routeName,params = {
            navigation:NavigationUtil.navigation
        };
        switch (menu) {
            case MENU.Tutorial:
            routeName = WEB_ROUTE_NAME;
            params = {
                url:"http://m.yrpiao.com",
                title:"易如票务"
            };
            break;
        }

        if(routeName){
            NavigationUtil.gotoPage(params,routeName);
        }

    }

    render() {
        return (
            <View style={{flex:1}}>
                <NavigationBar
                    title={"我的"}
                />

                <ScrollView style={{flex:1}}>

                    <TouchableOpacity style={styles.item}>
                        <View style={styles.itemLeft}>
                            <Ionicons style={{marginRight:10}} size={40} name={MENU.About.icon}/>
                            <Text>Hiicup</Text>
                        </View>
                        <RightArrow/>
                    </TouchableOpacity>

                    <Line/>
                    <Item onClick={(menu)=>this.onClick(menu)} menu={MENU.Tutorial}/>
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    <Line/>
                    <Item menu={MENU.Custom_Language}/>
                    <Line/>
                    <Item menu={MENU.Sort_Language}/>
                    <Text style={styles.groupTitle}>最热管理</Text>
                    <Item menu={MENU.Custom_Key}/>
                    <Line/>
                    <Item menu={MENU.Sort_Key}/>
                    <Line/>
                    <Item menu={MENU.Remove_Key}/>
                    <Text style={styles.groupTitle}>设置</Text>
                    <Item menu={MENU.Custom_Theme}/>
                    <Line/>
                    <Item menu={MENU.About_Author}/>
                    <Line/>
                    <Item menu={MENU.Feedback}/>

                </ScrollView>

                <StatusBar backgroundColor={'#678'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item:{
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:10,
        height:90,
    },
    itemLeft:{
        flexDirection: 'row',
        alignItems:'center'
    },
    groupTitle:{
        color:'gray',
        fontSize:14,
        padding: 10,
    }
});

const mapStateToProps = state=>({});

const mapDispatchToProps = dispatch=>({
    onThemeChange:theme=>dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(MemberPage);