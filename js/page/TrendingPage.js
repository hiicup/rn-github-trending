import React, {Component} from 'react';
import {StyleSheet, View,Text,Button,TouchableOpacity} from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"

import {connect} from "react-redux"
import actions from "../action/index"

import NavigationBar from "../common/NavigationBar"


type Props = {};
class TrendingPage extends Component<Props> {


    leftButton(callback){
        return <TouchableOpacity style={{paddingLeft:12}} onPress={callback}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color:'white'}}
            />
        </TouchableOpacity>
    }

    rightButton(callback){
        return <TouchableOpacity style={{paddingRight:12}} onPress={callback}>
            <Feather
                name={"search"}
                size={26}
                style={{color:'white'}}
            />
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title="我是头部导航栏"
                    leftButton={this.leftButton(()=>{
                        alert('back')
                    })}
                    rightButton={this.rightButton(()=>{
                        alert('search')
                    })}
                />
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>TrendingPage</Text>
                    <Button title={"换色"} onPress={()=>{
                        this.props.onThemeChange("#096")
                    }}/>
                </View>
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


const mapStateToProps = state=>({

});

const mapDispatchToProps = dispatch=>({
    onThemeChange: theme=>dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage);