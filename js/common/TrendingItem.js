import React, {Component} from "react"
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign";

import HtmlView from "react-native-htmlview"


export default class TrendingItem extends Component {
    render() {
        const {item} = this.props;

        let buildBy = [];

        item.contributors.forEach((img,index)=>{
            buildBy.push(
                <Image
                    key={`img-key-${index}`}
                    style={{height: 22, width: 22}}
                    source={{uri: img}}
                />
            )
        });

        const description = `<p>${item.description}</p>`;

        return <TouchableOpacity onPress={()=>this.props.onSelect(item)}>
            <View style={styles.container}>
                <Text style={{fontSize:16,color:'#212121',marginBottom:5}}>{item.fullName}</Text>
                <HtmlView onLinkPress={(url)=>{
                    alert(url);
                }} value={description}/>
                <Text style={{fontSize:14,color:'#757575',marginBottom:5}}>{item.meta}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: "row"}}>
                        <Text>Built by:</Text>
                        {buildBy}
                    </View>
                    <View style={{flexDirection: "row",justfyContent:"center"}}>
                        <Text>starts:</Text>
                        <Text>{item.starCount}</Text>
                    </View>
                    <View>
                        <AntDesign
                            name={"staro"}
                            size={20}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding:10,
        borderColor:'#eee',
        borderWidth:0.5,
        marginBottom: 5
    }
});