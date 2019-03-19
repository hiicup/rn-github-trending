import React, {Component} from "react"
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign";


export default class PopularItem extends Component {

    constructor(props){
        super(props);
        const {itemData} = this.props;

        this.state = {
            isFav:itemData.isFav
        };
    }

    updateStateIsFav(isFav){
        this.setState({
            isFav:isFav
        });
        this.props.itemData.isFav = isFav;
    }

    /**
     * 处理收藏点击事件
     */
    onFav(){
        const {onFav,itemData} = this.props;
        const isFav = !this.state.isFav;
        this.updateStateIsFav(isFav);
        onFav(itemData.item,isFav);
    }

    onClick(itemData){
        const {onSelect} = this.props;
        onSelect(itemData,(isFav)=>{
            this.updateStateIsFav(isFav);
        })
    }

    render() {
        const {itemData} = this.props;
        const item = itemData.item;

        return <TouchableOpacity onPress={()=>this.onClick(itemData)}>
            <View style={styles.container}>
                <Text style={{fontSize:16,color:'#212121',marginBottom:5}}>{item.full_name}</Text>
                <Text style={{fontSize:14,color:'#757575',marginBottom:5}}>{item.description}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: "row"}}>
                        <Text>Author:</Text>
                        <Image
                            style={{height: 22, width: 22}}
                            source={{uri: item.owner.avatar_url}}
                        />
                    </View>
                    <View style={{flexDirection: "row",justfyContent:"center"}}>
                        <Text>starts:</Text>
                        <Text>{item.stargazers_count}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={this.onFav.bind(this)}>
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