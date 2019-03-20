import React, {Component} from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";

export default class RightArrow extends Component {
    render() {
        return <Ionicons style={{alignSelf:'center'}} size={16} name={'ios-arrow-forward'}/>;
    }
}