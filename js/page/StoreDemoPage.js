import React, {Component} from 'react';
import {StyleSheet, View,Text,Button} from 'react-native';

import DataStore from "../expend/dao/DataStore";


type Props = {};
export default class StoreDemoPage extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            data:"暂无数据"
        };

        this.store = new DataStore();

    }

    render() {
        const url = "http://api.ruyi.yufu.in/Resources/all_list";
        return (
            <View style={styles.container}>

                <Button title="清除离线缓存" onPress={()=>{
                    this.store.removeData(url);
                    this.setState({
                        data:"本地缓存数据已经清楚"
                    });
                }}/>

                <Button title="加载数据" onPress={()=>{
                    this.setState({
                        data:"加载中..."
                    });

                    this.store.fetchData(url)
                        .then(json=>{
                            console.log(json);
                            this.setState({
                                data:JSON.stringify(json.timestamp)+"  "+ JSON.stringify(json.data.data.resources)
                            })
                        })
                        .catch(error=>{
                            this.setState({
                                data:error
                            })
                        })

                }}/>
                <Text>{this.state.data}</Text>
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
