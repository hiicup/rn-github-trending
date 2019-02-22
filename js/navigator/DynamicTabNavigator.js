import React, {Component} from 'react';
import {
    createBottomTabNavigator
} from "react-navigation"
import PopularPage from "./../page/PopularPage";
import TrendingPage from "./../page/TrendingPage";
import FavoritePage from "./../page/FavoritePage";
import MemberPage from "./../page/MemberPage";

import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"

import {BottomTabBar} from "react-navigation-tabs"


const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions:{
            tabBarLabel:"最热",
            tabBarIcon:({tintColor,focused})=>{
                return <MaterialIcons
                    name={"whatshot"}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions:{
            tabBarLabel:"趋势",
            tabBarIcon:({tintColor,focused})=>{
                return <Ionicons
                    name={"md-trending-up"}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions:{
            tabBarLabel:"收藏",
            tabBarIcon:({tintColor,focused})=>{
                return <MaterialIcons
                    name={"favorite"}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    MemberPage: {
        screen: MemberPage,
        navigationOptions:{
            tabBarLabel:"我的",
            tabBarIcon:({tintColor,focused})=>{
                return <Entypo
                    name={"user"}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    }
};

export default class DynamicTabNavigator extends Component {

    _tabNavigator() {
        const {PopularPage,TrendingPage,FavoritePage,MemberPage} = TABS;
        const tabs = {PopularPage,TrendingPage,FavoritePage,MemberPage};
        return createBottomTabNavigator(tabs,{
            tabBarComponent:TabBarComponent
        });
    }

    render() {
        const Tab = this._tabNavigator();
        return <Tab/>
    }
}


class TabBarComponent extends Component{


    constructor(props){
        super(props);
        this.theme = {
            tintColor:props.activeTintColor,
            updateTime:new Date().getTime()
        }
    }

    render(){

        const {routes,index} = this.props.navigation.state;

        if(routes[index].params){
            this.theme = routes[index].params.theme;
        }

        return <BottomTabBar
            {...this.props}
            activeTintColor={this.theme.tintColor || this.props.activeTintColor}
        />
    }
}