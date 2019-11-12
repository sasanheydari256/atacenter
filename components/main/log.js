import React, { Component } from 'react';
import { FlatList,TouchableOpacity,View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { connect } from "react-redux";
import Container from "./../container";
import { request } from "./../../service";
import { lang } from "./../../lang";
import { CText as Text } from "./../customComponents";
import { EnToFa,ToPrice } from "./../../mixin";
import R from "reactotron-react-native";
import PDate from "persian-jdate";

class Item extends Component{
    render() {
        const { Rate,Address,CategoryService,DateApp,UserName,Price,RequestId } = this.props
        const { PRICE_UNIT } = this.props.strings
        return (
            <TouchableOpacity style={styles.itemContainer}>
                <Text style={[styles.txt,styles.date]}>{new PDate(DateApp).format("YYYY-MM-DD  HH:mm")}</Text>
                <View style={{ flexDirection:"row",justifyContent:"center" }}>
                    <Text style={[styles.txt,styles.serviceName]}>{EnToFa(CategoryService)}</Text>
                    <Text style={[styles.txt,styles.price]}>{`${EnToFa(ToPrice(Price))} ${PRICE_UNIT}`}</Text>    
                </View>
                
                <Text style={[styles.txt]} numberOfLines={5}>{EnToFa(Address)}</Text>
                <Text>{`امتیاز کاربر: ${EnToFa(Rate)}`}</Text>
            </TouchableOpacity>
        );
    }
}

class Log extends Component{
    state = {
        loading:false,
        list:[],
        strings:{}
    }

    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = { 
                ...langs.log,
                ...langs.globals 
            };
            this.setState({ strings })
        } catch (error) {
            
        }
        this._getLogList()
    }

    _getLogList = ()=>{
        const { UserId } = this.props.configs
        request("POST","/api/Listcenterservice",{serviceid:UserId},
            ()=>{ this.setState({ loading:true }) },
            (list)=>{
                this.setState({ loading:false,list })
            },
            ()=>{ this.setState({ loading:false }) },
        )
    }

    render() {
        const { loading,list } = this.state
        const { TITLE,PRICE_UNIT } = this.state.strings
        return (
            <Container showMenu title={TITLE}>
                <FlatList
                    data={list}
                    renderItem={({item})=> <Item { ...item } strings={{ PRICE_UNIT }}/>}
                    keyExtractor={(item)=> `${item.RequestId}`}
                    style={{ height: "100%" }}
                    contentContainerStyle={{ justifyContent:"flex-start",alignItems:"stretch",paddingBottom: 10 }}
                    onRefresh={this._getLogList}
                    refreshing={loading}
                    horizontal={false}
                    alwaysBounceVertical={true}
                />
            </Container>
        );
    }
}

const styles = EStyleSheet.create({
    itemContainer:{ margin:"10rem",marginVertical:0,marginTop:"10rem",borderColor:"$lightBlueColor",borderWidth:1,padding:"10rem",borderRadius:"5rem",elevation:10,backgroundColor:"white" },
    txt:{ color:"gray",fontSize:"12rem" },
    serviceName:{ flex:1,fontSize:"16rem" },
    address:{  },
    price:{ fontSize:"16rem" },
    date:{ color:"black",alignSelf:"flex-end" }
})

const state = state=>({
    configs:state.configs
})
export default connect(state)(Log)