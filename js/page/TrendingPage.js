import React, {Component} from 'react';
import {
    StyleSheet, View, Text, FlatList, RefreshControl,ActivityIndicator,
    ToastAndroid, StatusBar, TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import {createMaterialTopTabNavigator} from "react-navigation";

import Ionicons from "react-native-vector-icons/Ionicons"

import {connect} from "react-redux"
import actions from "../action/index"

import TrendingItem from "../common/TrendingItem"

import NavigationBar from "../common/NavigationBar"
import TrendingDialog,{items as TrendingItems} from "../common/TrendingDialog"
import NavigationUtil from "../navigator/NavigationUtil";
import FavDao from "../expend/dao/FavDao";
import {FLAG_TYPE} from "../expend/dao/DataStore";
import EventBus from "react-native-event-bus";
import Event from "../common/events";
import Conf from "../common/Conf";


const URL = "https://github.com/trending/";

const ALL_Text = 'All';

const EVENT_SINCE_CHANGE = 'EVENT_SINCE_CHANGE';

const favDao = new FavDao(FLAG_TYPE.TRENDING);

type Props = {};
export default class TrendingPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.tabNames = [ALL_Text,"Java",'Python'];
        this.state = {
            tabItem:TrendingItems[0]
        };
    }

    _genTabs() {
        const tabs = {};

        this.tabNames.forEach((item, index) => {
            tabs[`Tab${index}`] = {
                screen: (props) => <TrendingTabPage {...props} tabItem={this.state.tabItem} name={item}/>,
                navigationOptions: {
                    title: item
                }
            };
        });

        return tabs;
    }

    onClickSince(item){
        this.dialog.close();
        this.setState({
            tabItem:item
        });
        DeviceEventEmitter.emit(EVENT_SINCE_CHANGE,item);
    }

    renderTitleView(){
        return <TouchableOpacity onPress={()=>this.dialog.show()} style={{flexDirection:'row', justifyContent:"center"}}>
            <Text style={styles.title}>最热</Text>
            <Text style={styles.title}>{this.state.tabItem.text}</Text>
            <Ionicons name={"md-arrow-dropdown"} size={26} style={{color:"white"}}/>
        </TouchableOpacity>
    }

    genNav(){
        if(!this.tabNav){
            this.tabNav = createMaterialTopTabNavigator(this._genTabs(), {
                tabBarOptions: {
                    upperCaseLabel: false, // 禁止自动大写
                    scrollEnabled: true, // 启用横向滚动
                    style: {
                        backgroundColor: '#678' // 设置整个tabBar的底色
                    },
                    tabStyle: styles.tabStyle,                  // 设置每一个tab样式，比如宽度
                    indicatorStyle: styles.indicatorStyle,    // 底部游标的样式
                    labelStyle: styles.labelStyle                // 文字样式
                }
            });
        }
        return this.tabNav;
    }

    render() {
        const TabNav = this.genNav();
        return (
            <View style={{flex:1}}>
                <NavigationBar
                    titleView={this.renderTitleView()}
                />
                <TabNav/>
                <TrendingDialog ref={dialog=>{this.dialog = dialog}} onClick={item=>this.onClickSince(item)} onClose={()=>{}}/>
            </View>
        );
    }
}

const PAGE_SIZE = 8;

class TabPage extends Component {

    constructor(props) {
        super(props);
        const {name,tabItem} = this.props;
        this.storeName = name;
        this.tabItem = tabItem;
        this.isFavChanged = false;
        this.timerQueue = [];
    }

    delayLoadData(){
        this.timerQueue.push(
            setTimeout(()=>this.loadData(),100)
        )
    }

    componentDidMount() {
        this.loadData();
        this.sinceChangeEventListener = DeviceEventEmitter.addListener(EVENT_SINCE_CHANGE,item=>{
            this.tabItem = item;

            this.delayLoadData();
        });

        EventBus.getInstance().addListener(Event.fav_trending_cancel,this.favCancelListener = ()=>{
            this.isFavChanged = true;
        });

        EventBus.getInstance().addListener(Event.bottom_navbar_changed,this.tabChangedListener = (data)=>{
            if(data.to === Conf.NAV_INDEX.TRENDING && this.isFavChanged){
                this.delayLoadData();
            }
        })

    }

    componentWillUnmount() {
        if(this.sinceChangeEventListener){
            this.sinceChangeEventListener.remove();
        }

        this.timerQueue.forEach((currentTimer,index,arr)=>{
            clearTimeout(currentTimer);
        });

        EventBus.getInstance().removeListener(this.favCancelListener);
        EventBus.getInstance().removeListener(this.tabChangedListener);
    }


    loadData(isLoadMore) {
        this.isFavChanged = false;
        const {onLoadTrendingData, onLoadTrendingMoreData} = this.props;
        let store = this.getStore();
        const url = this.buildFetchUrl(this.storeName);
        console.log("请求地址：",url);
        if (isLoadMore) {
            onLoadTrendingMoreData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, (error) => {
                ToastAndroid.showWithGravity('没有更多数据',ToastAndroid.SHORT,ToastAndroid.CENTER);
            },favDao)
        } else {
            onLoadTrendingData(this.storeName, url,PAGE_SIZE,favDao);
        }
    }

    buildFetchUrl(key) {

        if(key === ALL_Text){
            key = '';
        }

        return URL + key + '?since='+this.tabItem.since;
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            itemData={item}
            onFav={(item,isFav)=>{
                FavDao.onFav(favDao,item,isFav);
            }}
            onSelect={(itemData,callback) => {
                NavigationUtil.gotoPage({
                    navigation:NavigationUtil.navigation,
                    itemData:itemData,
                    favDao:favDao,
                    flag:FLAG_TYPE.TRENDING,
                    callback
                },"DetailPage")
            }}/>
    }

    getStore() {
        const {trending} = this.props;
        let store = trending[this.storeName];

        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                pageIndex: 1,
                hideLoadingMore: true,
            };
        }
        return store;
    }

    genIndicator() {
        return this.getStore().hideLoadingMore ? null :
            <View style={{alignItems:'center'}}>
                <ActivityIndicator
                    style={{margin:5,color:'red'}}
                />
                <Text>正在加载更多...</Text>
            </View>
    }

    render() {

        let store = this.getStore();

        return <View style={styles.container}>
            <FlatList
                data={store.projectModes}
                renderItem={item => this.renderItem(item)}
                keyExtractor={item => "" + item.item.fullName}
                refreshControl={
                    <RefreshControl
                        title={"加载中..."}
                        refreshing={store.isLoading}
                        onRefresh={() => this.loadData()}
                    />
                }
                ListFooterComponent={() =>this.genIndicator()}
                onEndReached={()=>{
                    // 设置定时器，防止onMomentumScrollBegin还未执行
                    setTimeout(()=>{
                        if(this.canLoadMore){
                            this.loadData(true);
                            this.canLoadMore = false;
                        }
                    },100)
                }}
                onMomentumScrollBegin={()=>{
                    this.canLoadMore = true;
                }}
                onEndReachedThreshold={0.5}
            />
            <StatusBar backgroundColor={'#678'} />
        </View>
    }
}

const mapStateToProps = state => ({
    trending: state.trending
});

const mapDispatchToProps = dispatch => ({
    onLoadTrendingData: (storeName, url,pageSize,favDao) => {
        dispatch(actions.onLoadTrendingData(storeName, url,pageSize,favDao));
    },
    onLoadTrendingMoreData: (storeName, pageIndex, pageSize, items, callback,favDao) => {
        dispatch(actions.onLoadTrendingMoreData(storeName, pageIndex, pageSize, items, callback,favDao));
    }
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TabPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    tabStyle: {
        width: 120,
    },
    indicatorStyle: {
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13
    },
    title: {
        fontSize:16,
        color:'white'
    },
});
