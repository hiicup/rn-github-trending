import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {WebView} from "react-native-webview";

import NavigationBar from "../common/NavigationBar"
import ViewHelper from "../common/ViewHelper";
import NavigationUtil from "../navigator/NavigationUtil";

const GITHUB_BASE_URL = 'https://github.com/';
type Props = {};
export default class DetailPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {item} = this.params;
        this.item = item;
        this.url = item.html_url || GITHUB_BASE_URL + item.fullName;
        const title = item.full_name || item.fullName;

        this.state = {
            url: this.url,
            title: title,
            canGoBack: false
        };

    }

    onBack() {
        console.log(this.state.canGoBack);
        if (this.state.canGoBack) {
            this.webview.goBack();
        } else {
            NavigationUtil.goback({
                navigation: this.props.navigation
            })
        }
    }

    onShare() {
        alert("share");
    }

    onFav() {
        alert('fav');
    }

    renderRightButton() {
        const favoriteView = ViewHelper.favoriteView(this.onFav);
        const shareView = ViewHelper.shareView(this.onShare);
        return <View style={{flexDirection: 'row', paddingRight: 15}}>
            <View style={{paddingRight: 5}}>
                {favoriteView}
            </View>
            {shareView}
        </View>
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationBar
                    leftButton={ViewHelper.leftBackBtnView(() => this.onBack())}
                    rightButton={this.renderRightButton()}
                    title={this.state.title}
                />
                <WebView
                    ref={(webview) => this.webview = webview}
                    source={{uri: this.state.url}}
                    startInLoadingState={true}
                    onNavigationStateChange={(webState) => {
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
