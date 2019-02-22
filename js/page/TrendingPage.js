import React, {Component} from 'react';
import {StyleSheet, View,Text,Button} from 'react-native';


type Props = {};
export default class TrendingPage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>TrendingPage</Text>
                <Button title={"换色"} onPress={()=>{
                    this.props.navigation.setParams({
                        theme:{
                            tintColor: "red",
                            updateTime:new Date().getTime()
                        }
                    })
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
