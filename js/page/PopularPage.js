import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from "react-navigation";
import NavigationUtil from "../navigator/NavigationUtil";


type Props = {};
export default class PopularPage extends Component<Props> {

    constructor(props) {
        super(props)
        this.tabNames = ['Java', 'Python', 'Golang', 'PHP', 'Javascript', 'Rust', 'Swift']
    }

    _genTabs() {
        const tabs = {};

        this.tabNames.forEach((item, index) => {
            tabs[`Tab${index}`] = {
                screen: (props)=><PopularTab {...props} name={item} />,
                navigationOptions:{
                    title:item
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
                indicatorStyle:styles.indicatorStyle,    // 底部游标的样式
                labelStyle:styles.labelStyle                // 文字样式
            }
        });

        return (
            <TabNavigator/>
        );
    }
}


class PopularTab extends Component {
    render() {
        return <View>
            <Text onPress={() => {
                NavigationUtil.gotoPage({
                    navigation: NavigationUtil.navigation
                }, "DetailPage")
            }}>{this.props.name}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabStyle: {
        minWidth: 50,
    },
    indicatorStyle:{
        backgroundColor:'white'
    },
    labelStyle:{
        fontSize:13
    }
});
