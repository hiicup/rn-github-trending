import React, {Component} from 'react';

import {connect} from "react-redux"

import {
    createBottomTabNavigator
} from "react-navigation"
import PopularPage from "./../page/PopularPage";
import TrendingPage from "./../page/TrendingPage";
import FavoritePage from "./../page/FavoritePage";
import MemberPage from "./../page/MemberPage";

import Event from "../common/events";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";

import {BottomTabBar} from "react-navigation-tabs";
import EventBus from "react-native-event-bus";

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
            title:"趋势",
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
                return <AntDesign
                    name={"staro"}
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

class DynamicTabNavigator extends Component {

    _tabNavigator() {
        if (this.Tabs){
            return this.Tabs;
        }

        const {PopularPage,TrendingPage,FavoritePage,MemberPage} = TABS;
        const tabs = {PopularPage,TrendingPage,FavoritePage,MemberPage};
        return this.Tabs =  createBottomTabNavigator(tabs,{
            tabBarComponent:props=>{
                return <TabBarComponent theme={this.props.theme} {...props} />
            }
        });
    }

    render() {
        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => {
                EventBus.getInstance().fireEvent(Event.bottom_navbar_changed, {//发送底部tab切换的事件
                    from: prevState.index,
                    to: newState.index
                })
            }}
        />
    }
}


class TabBarComponent extends Component{


    constructor(props){
        super(props);
    }

    render(){
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme}
        />
    }
}

const mapStateToProps = state=>({
    theme:state.theme.theme
});

export default connect(mapStateToProps)(DynamicTabNavigator);
