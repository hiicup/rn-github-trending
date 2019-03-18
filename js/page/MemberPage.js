import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';

import actions from "../action"
import {connect} from "react-redux"
import FavDao from "../expend/dao/FavDao";


type Props = {};
class MemberPage extends Component<Props> {

    render() {
        return (
            <View style={styles.container}>
                <Text>MemberPage</Text>
                <Button title={"换色"} onPress={()=>{
                    this.props.onThemeChange("#056")
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

const mapStateToProps = state=>({});

const mapDispatchToProps = dispatch=>({
    onThemeChange:theme=>dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(MemberPage);