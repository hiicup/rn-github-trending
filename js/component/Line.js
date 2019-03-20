import React, {Component} from 'react';
import {View} from "react-native";
import BaseStyles from "../res/Styles"

class Line extends Component {
    render() {
        return <View style={[BaseStyles.line,{marginTop:1}]}/>
    }
}

export default Line;
