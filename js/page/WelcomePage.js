import React, {Component} from 'react';
import {StyleSheet, View,Text} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import Conf from "../common/Conf"

import SplashScreen from "react-native-splash-screen"


type Props = {};
export default class WelcomePage extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            time:Conf.WELCOME_TIME_SECONDS
        };
    }

    componentDidMount() {
        // 关闭启动屏
        SplashScreen.hide();
        if(Conf.ENV_DEV){
            NavigationUtil.resetHomePage(this.props)
        }else{
            this.timer = setInterval(()=>{

                if(this.state.time > 1){
                    this.setState({
                        time:this.state.time-1
                    });
                }else{
                    NavigationUtil.resetHomePage(this.props)
                }
            },1000);
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize:20}}>
                    ReactNative学习项目
                    <Text style={{fontSize:18}}>({this.state.time})</Text>
                </Text>

            </View>
        );
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