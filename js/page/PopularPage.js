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

import PopularItem from "../common/PopularItem"

import NavigationBar from "../common/NavigationBar"
import {FLAG_TYPE} from "../expend/dao/DataStore";
import NavigationUtil from "../navigator/NavigationUtil";
import FavDao from "../expend/dao/FavDao";


const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STRING = '&sort=stars';

const favDao = new FavDao(FLAG_TYPE.POPULAR);

type Props = {};
export default class PopularPage extends Component<Props> {

    constructor(props) {
        super(props);
        // this.tabNames = ['Java', 'Python', 'Golang',"Javascript","Rust","Ruby"]
        this.tabNames = ['Java']
    }

    _genTabs() {
        const tabs = {};

        this.tabNames.forEach((item, index) => {
            tabs[`Tab${index}`] = {
                screen: (props) => <PopularTabPage {...props} name={item}/>,
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

class PopularTab extends Component {

    constructor(props) {
        super(props);
        const {name} = this.props;
        this.storeName = name;
    }

    componentDidMount() {
        this.loadData();
    }


    loadData(isLoadMore) {
        const {onLoadPopularData, onLoadPopularMoreData} = this.props;
        let store = this.getStore();
        const url = PopularTab.buildFetchUrl(this.storeName);
        if (isLoadMore) {
            onLoadPopularMoreData(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, (error) => {
                ToastAndroid.showWithGravity('没有更多数据',ToastAndroid.SHORT,ToastAndroid.CENTER);
            })
        } else {
            onLoadPopularData(this.storeName, url,PAGE_SIZE);
        }
    }

    static buildFetchUrl(key) {
        return URL + key + QUERY_STRING;
    }

    renderItem(data) {
        return <PopularItem
            itemData={data.item}
            onFav={(item,isFav)=>{
                FavDao.onFav(favDao,item,isFav);
            }}
            onSelect={(itemData,callback) => {
                NavigationUtil.gotoPage({
                    navigation:NavigationUtil.navigation,
                    itemData,
                    callback,
                    favDao
                },"DetailPage")
            }}/>
    }

    getStore() {
        const {popular} = this.props;
        let store = popular[this.storeName];

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
                keyExtractor={item => "" + item.item.id}
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
    popular: state.popular
});

const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url,pageSize) => {
        dispatch(actions.onLoadPopularData(storeName, url,pageSize,favDao));
    },
    onLoadPopularMoreData: (storeName, pageIndex, pageSize, items, callback) => {
        dispatch(actions.onLoadPopularMoreData(storeName, pageIndex, pageSize, items, callback,favDao));
    }
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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
