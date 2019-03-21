import React, {Component} from 'react';
import {StyleSheet, View, Text, BackHandler} from 'react-native';
import {WebView} from "react-native-webview";

import NavigationBar from "../common/NavigationBar"
import ViewHelper from "../common/ViewHelper";
import NavigationUtil from "../navigator/NavigationUtil";

type Props = {};
export default class DetailPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {url,title} = this.params;

        this.url = url;
        this.title = title;

        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
        };

    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress",this.onBackPress.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress",this.onBackPress.bind(this));
    }

    onBackPress(){
        this.onBack();
        return true;
    };

    onBack() {

        // 目前有BUG,如果是但也没应用，无法检测到页面变化，导致无法返回上级导航
        NavigationUtil.goback({
            navigation: this.props.navigation
        });
        return;

        console.log("初始URL:",this.url);
        console.log("当前URL:",this.state.url);

        if (this.state.canGoBack) {
            console.log("页面内返回：");
            this.webview.goBack();
        } else {
            console.log("导航返回");
            NavigationUtil.goback({
                navigation: this.props.navigation
            })
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationBar
                    leftButton={ViewHelper.leftBackBtnView(() => this.onBack())}
                    title={this.state.title}
                />
                <WebView
                    ref={(webview) => this.webview = webview}
                    source={{uri: this.state.url}}
                    startInLoadingState={true}
                    onNavigationStateChange={(webState) => {
                        console.log("页面状态发生变化：",webState);
                        this.setState({
                            url: webState.url,
                            canGoBack: webState.canGoBack
                        });
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    }
});
