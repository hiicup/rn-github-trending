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

const URL = "https://github.com/trending/";

const ALL_Text = 'All';

const EVENT_SINCE_CHANGE = 'EVENT_SINCE_CHANGE';

type Props = {};
export default class TrendingPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.tabNames = [ALL_Text,"Java",'Python']
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
    }

    componentDidMount() {
        this.loadData();
        this.sinceChangeEventListener = DeviceEventEmitter.addListener(EVENT_SINCE_CHANGE,item=>{
            this.tabItem = item;
            this.loadData();
        });
    }

    componentWillUnmount() {
        if(this.sinceChangeEventListener){
            this.sinceChangeEventListener.remove();
        }
    }


    loadData(isLoadMore) {
        const {onLoadTrendingData, onLoadTrendingMoreData} = this.props;
        let store = this.getStore();
        const url = this.buildFetchUrl(this.storeName);
        console.log("请求地址：",url);
        if (isLoadMore) {
            onLoadTrendingMoreData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, (error) => {
                ToastAndroid.showWithGravity('没有更多数据',ToastAndroid.SHORT,ToastAndroid.CENTER);
            })
        } else {
            onLoadTrendingData(this.storeName, url,PAGE_SIZE);
        }
    }

    buildFetchUrl(key) {

        if(key === ALL_Text){
            key = '';
        }

        return URL + key + '?since='+this.tabItem.since;
    }

    renderItem(item) {
        return <TrendingItem item={item.item} onSelect={() => {
            console.log('xxx')
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
                keyExtractor={item => "" + item.fullName}
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
    onLoadTrendingData: (storeName, url,pageSize) => {
        dispatch(actions.onLoadTrendingData(storeName, url,pageSize));
    },
    onLoadTrendingMoreData: (storeName, pageIndex, pageSize, items, callback) => {
        dispatch(actions.onLoadTrendingMoreData(storeName, pageIndex, pageSize, items, callback));
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
