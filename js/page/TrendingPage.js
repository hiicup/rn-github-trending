import React, {Component} from 'react';
import {StyleSheet, View,Text,Button} from 'react-native';

import {connect} from "react-redux"
import actions from "../action/index"


type Props = {};
class TrendingPage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>TrendingPage</Text>
                <Button title={"换色"} onPress={()=>{
                    this.props.onThemeChange("#096")
                }}/>
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


const mapStateToProps = state=>({

});

const mapDispatchToProps = dispatch=>({
    onThemeChange: theme=>dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage);