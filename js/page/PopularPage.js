import React, {Component} from 'react';
import {StyleSheet, View,Text} from 'react-native';
import {createMaterialTopTabNavigator} from "react-navigation";
import NavigationUtil from "../navigator/NavigationUtil";


type Props = {};
export default class PopularPage extends Component<Props> {
    render() {
        const TabNavigator = createMaterialTopTabNavigator({
            PopularTab1:{
                screen:PopularTab,
                navigationOptions:{
                    title:"tab-1"
                }
            },
            PopularTab2:{
                screen:PopularTab,
                navigationOptions:{
                    title:"tab-2"
                }
            }
        });

        return (
            <TabNavigator/>
        );
    }
}


class PopularTab extends Component{
    render(){
        console.log(NavigationUtil.navigation);
        return <View>
            <Text onPress={()=>{
                console.log("进入详情页");
                NavigationUtil.gotoPage({
                    navigation:NavigationUtil.navigation
                },"DetailPage")
            }}>tab</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
