import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    ToastAndroid,
    StatusBar
} from 'react-native';
import {createMaterialTopTabNavigator} from "react-navigation";

import {connect} from "react-redux"
import actions from "../action/index"

import TrendingItem from "../common/TrendingItem"

import NavigationBar from "../common/NavigationBar"
import Store, {FLAG_TYPE} from "../expend/dao/DataStore";


const URL = "https://github.com/trending/";
const QUERY_STRING = '?since=daily';


type Props = {};
export default class TrendingPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.tabNames = ['All Language',"Java",'Python']
    }

    _genTabs() {
        const tabs = {};

        this.tabNames.forEach((item, index) => {
            tabs[`Tab${index}`] = {
                screen: (props) => <TrendingTabPage {...props} name={item}/>,
                navigationOptions: {
                    title: item
                }
            };
        });

        return tabs;
    }

    render() {
        const TabNavigator = createMaterialTopTabNavigator(this._genTabs(), {
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

        return (
            <View style={{flex:1}}>
                <NavigationBar
                    title="最热"
                />
                <TabNavigator/>
            </View>
        );
    }
}

const PAGE_SIZE = 8;

class TabPage extends Component {

    constructor(props) {
        super(props);
        const {name} = this.props;
        this.storeName = name;
    }

    componentDidMount() {
        this.loadData();
    }


    loadData(isLoadMore) {
        const {onLoadTrendingData, onLoadTrendingMoreData} = this.props;
        let store = this.getStore();
        const url = TabPage.buildFetchUrl(this.storeName);
        if (isLoadMore) {
            onLoadTrendingMoreData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, (error) => {
                ToastAndroid.showWithGravity('没有更多数据',ToastAndroid.SHORT,ToastAndroid.CENTER);
            })
        } else {
            onLoadTrendingData(this.storeName, url,PAGE_SIZE);
        }
    }

    static buildFetchUrl(key) {

        if(key === 'All Language'){
            key = '';
        }

        return URL + key + QUERY_STRING;
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
    }
});
