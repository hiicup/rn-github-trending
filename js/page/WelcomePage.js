import React, {Component} from 'react';
import {StyleSheet, View,Text} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";


type Props = {};
export default class WelcomePage extends Component<Props> {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.timer = setTimeout(()=>{
            NavigationUtil.resetHomePage(this.props)
        },3000)
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize:20}}>RN学习练手项目</Text>
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