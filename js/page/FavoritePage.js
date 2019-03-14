import React, {Component} from 'react';
import {StyleSheet, View, Text, Button,Modal} from 'react-native';
import actions from "../action"
import {connect} from "react-redux"

import NavigationBar from "../common/NavigationBar"
import TrendingDialog from "../common/TrendingDialog"


type Props = {};
class FavoritePage extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            visible:true
        }
    }

    render() {

        const titleView = <View>
            <Text style={{
                fontSize:16,
                color:'white'
            }}>收藏</Text>
        </View>;

        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView={titleView}
                />
                <TrendingDialog onClick={(item)=>{
                    alert(item.text);
                }} onClose={()=>{
                    alert("onClose")
                }}/>
                <Text>FavoritePage</Text>

                <Button title={"弹窗"} onPress={()=>{
                    this.setState({
                        visible:true
                    })
                }}/>

                <Button title={"换色"} onPress={()=>{
                    this.props.onThemeChange("red")
                }}/>
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

const mapStateToProps = state=>({});

const mapDispatchToProps = dispatch=>({
    onThemeChange:theme=>dispatch(actions.onThemeChange(theme))
});


export default connect(mapStateToProps,mapDispatchToProps)(FavoritePage)