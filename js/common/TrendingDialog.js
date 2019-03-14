import React, {Component} from "react"
import {View, Modal, Text, TouchableOpacity, StyleSheet} from "react-native"
import PropTyps from "prop-types"

import Ionicons from "react-native-vector-icons/Ionicons"

class Item {
    constructor(text, since) {
        this.text = text;
        this.since = since;
    }
}

export const items = [
    new Item("今日","daily"),
    new Item("本周","weekly"),
    new Item("本月","monthly")
];

export default class TrendingDialog extends Component {

    static propTypes = {
        onClick:PropTyps.func.isRequired,
        onClose:PropTyps.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    show() {
        this.setState({
            visible: true
        })
    }

    close() {
        this.setState({
            visible: false
        });
    }

    render() {

        const {onClick, onClose} = this.props;

        return <Modal
            animationType={'fade'}
            visible={this.state.visible}
            transparent={true}
            onRequestClose={()=>onClose}
        >

            <TouchableOpacity onPress={() => this.close()} style={styles.container}>
                <Ionicons name={"md-arrow-dropup"} size={28} style={styles.arrow}/>
                <View style={styles.box}>
                    {items.map((current,index,arr)=>{
                        return (
                            <TouchableOpacity key={index} onPress={()=>onClick(current)}>
                                <View style={styles.item}>
                                    <Text>{current.text}</Text>
                                </View>
                                {
                                    index === items.length-1?null:
                                        <View style={styles.line}/>
                                }
                            </TouchableOpacity>
                        );
                    })}

                </View>

            </TouchableOpacity>

        </Modal>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingTop:30
    },
    box: {
        backgroundColor: 'white',
        borderRadius: 3,
    },
    item: {
        padding:8,
        paddingLeft: 30,
        paddingRight: 30
    },
    line:{
        height: 0.5,
        backgroundColor: '#ccc'
    },
    arrow:{
        color:'white',
        marginBottom:-11
    }

});