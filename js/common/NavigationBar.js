import React, {Component} from "react"
import PropTypes from "prop-types"
import {ViewPropTypes, View, Text, StatusBar, StyleSheet,Platform} from "react-native"

const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default']),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string
};


const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;

export default class NavigationBar extends Component {

    static defaultProps = {
        statusBar: {
            barStyle: "light-content",
            hidden: false
        },
        hide:false,
    };

    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
    };


    leftButton() {
        return <View style={styles.leftButtonContainer}>
            {this.props.leftButton ? this.props.leftButton : null}
        </View>
    }

    rightButton() {
        return <View style={styles.rightButtonContainer}>
            {this.props.rightButton ? this.props.rightButton : null}
        </View>
    }

    render() {
        let statusBar = this.props.statusBar.hidden ? null :
            <View style={styles.statusBarContainer}>
                <StatusBar {...this.props.statusBar}/>
            </View>;

        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>;

        let content = this.props.hide ? null :
            <View style={styles.contentContainer}>
                {this.leftButton()}
                <View style={[styles.titleContainer,this.props.titleLayoutStyle]}>{titleView}</View>
                {this.rightButton()}
            </View>;

        return <View style={[styles.container,this.props.style]}>
            {statusBar}
            {content}
        </View>

    }

}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#678',
    },
    contentContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:Platform.OS==='ios'?NAV_BAR_HEIGHT_IOS:NAV_BAR_HEIGHT_ANDROID,
    },
    titleContainer:{
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:0,
        bottom:0,
        left:50,
        right:50,
    },
    title: {
        fontSize:16,
        color:'white'
    },
    leftButtonContainer: {},
    rightButtonContainer: {},
    statusBarContainer:{
        height:Platform.OS==='ios'?STATUS_BAR_HEIGHT:0
    },
});