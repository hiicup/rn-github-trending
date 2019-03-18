import React, {Component} from "react"
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign";

import HtmlView from "react-native-htmlview"


export default class TrendingItem extends Component {

    constructor(props){
        super(props);

        this.state = {
            isFav:props.itemData.isFav
        }

    }

    /**
     * 从属性来检测变化，更新到状态上
     * @param nextProps
     * @param prevState
     * @returns {*}
     */
    static getDerivedStateFromProps(nextProps,prevState){
        const isFav = nextProps.itemData.isFav;
        if(isFav !== prevState.isFav){
            return {
                isFav:isFav
            }
        }
        return null;
    }

    updateFavState(isFav){
        this.props.itemData.isFav = isFav;
        this.setState({
            isFav:isFav
        })
    }

    onFavPress(){
        this.updateFavState(!this.state.isFav);
        this.props.onFav(this.props.itemData.item,!this.state.isFav);
    }

    onSelect(itemData){
        this.props.onSelect(itemData,(isFav)=>{
            this.updateFavState(isFav);
        });
    }

    render() {
        const {itemData} = this.props;
        const item = itemData.item;

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

        return <TouchableOpacity onPress={()=>this.onSelect(itemData)}>
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
                        <TouchableOpacity onPress={(item)=>this.onFavPress()}>
                            <AntDesign
                                name={this.state.isFav?"star":"staro"}
                                size={20}
                            />
                        </TouchableOpacity>
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