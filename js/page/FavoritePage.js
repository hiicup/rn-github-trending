import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList,RefreshControl,StatusBar} from 'react-native';
import actions from "../action"
import {connect} from "react-redux"

import NavigationBar from "../common/NavigationBar"

import {createMaterialTopTabNavigator} from "react-navigation"
import FavDao from "../expend/dao/FavDao";
import {FLAG_TYPE} from "../expend/dao/DataStore";
import PopularItem from "../common/PopularItem";
import NavigationUtil from "../navigator/NavigationUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from "react-native-event-bus";
import Event from "../common/events";
import Conf from "../common/Conf";

const tabSet = [
    {name:FLAG_TYPE.POPULAR,label:'最热'},
    {name:FLAG_TYPE.TRENDING,label:'趋势'},
];

type Props = {};
export default class FavoritePage extends Component<Props> {

    componentDidMount() {
        // favDao.getAllFav()
        //     .then(items=>{
        //         console.log("数据",items);
        //     })
        //     .catch(e=>{
        //         console.error(e);
        //     })
    }


    render() {
        const tabs =[];
        tabSet.forEach((item,index)=>{
            tabs[`tab-${index}`] = {
                screen:props=><TabPage {...props} name={item.name}/>,
                navigationOptions:{
                    title:item.label
                }
            }
        });

        const TabNavigator = createMaterialTopTabNavigator(tabs,{
            tabBarOptions: {
                upperCaseLabel: false, // 禁止自动大写
                style: {
                    backgroundColor: '#678' // 设置整个tabBar的底色
                },
                tabStyle: styles.tabStyle,                  // 设置每一个tab样式，比如宽度
                indicatorStyle: styles.indicatorStyle,    // 底部游标的样式
                labelStyle: styles.labelStyle                // 文字样式
            }
        });

        return (
            <View style={{flex:1}}>
                <NavigationBar
                    title={"收藏"}
                />
                <TabNavigator/>
                <StatusBar backgroundColor={'#678'} />
            </View>
        );
    }
}

class TabScreen extends Component{
    constructor(props){
        super(props);
        const {name} = this.props;
        this.storeName = name;
        this.favDao = new FavDao(name);
    }

    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(Event.bottom_navbar_changed,this.tabChangedListener = (data)=>{
            if(data.to === Conf.NAV_INDEX.FAV){
                this.timer = setTimeout(()=>this.loadData(),200)
            }
        })
    }

    componentWillUnmount() {
        this.timer&&clearTimeout(this.timer);
        EventBus.getInstance().removeListener(this.tabChangedListener);
    }


    getData(){
        const {fav} = this.props;
        let data = fav[this.storeName];
        if(!data){
            data = {
                isLoading:false,
                projectModes:[]
            };
        }
        return data;
    }

    loadData(){
        const {loadData} = this.props;
        loadData(this.storeName);
    }

    getKey(item){
        if(this.isPopular()){
            return item.id || item.fullName;
        }
        return item.fullName;
    }

    isPopular(){
        return this.storeName === FLAG_TYPE.POPULAR;
    }

    onFav(item,isFav){
        // 触发事件，有收藏被取消了
        const eventName = this.isPopular()?Event.fav_popular_cancel:Event.fav_trending_cancel;
        EventBus.getInstance().fireEvent(eventName);
        FavDao.onFav(this.favDao,item,isFav);
    }

    renderItem(data){

        const Item = this.isPopular()?PopularItem:TrendingItem;

        return <Item
            itemData={data.item}
            onFav={(item,isFav)=>this.onFav(item,isFav)}
            onSelect={(itemData,callback) => {
                NavigationUtil.gotoPage({
                    navigation:NavigationUtil.navigation,
                    itemData,
                    callback,
                    favDao:this.favDao
                },"DetailPage")
            }}/>
    }

    render(){
        const store = this.getData();

        return <View style={styles.container}>
            <FlatList
                data={store.projectModes}
                renderItem={item => this.renderItem(item)}
                keyExtractor={item => "" + this.getKey(item.item)}
                refreshControl={
                    <RefreshControl
                        title={"加载中..."}
                        refreshing={store.isLoading}
                        onRefresh={() => this.loadData()}
                    />
                }
            />
        </View>
    }
}

const mapStateToProps = state=>({
    fav:state.fav
});

const mapDispatchToProps = dispatch=>({
    loadData:storeName=>dispatch(actions.createActionLoadData(storeName))
});


const TabPage = connect(mapStateToProps,mapDispatchToProps)(TabScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    tabStyle: {
    },
    indicatorStyle: {
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13
    }
});