import React, {Component} from 'react';
import {StyleSheet, View,Text} from 'react-native';


type Props = {};
export default class DetailPage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>DetailPage</Text>
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
