import React, { Component } from 'react';
import { connect } from "react-redux";
import { setTempState } from "./../../redux/actions/index";
import { View } from "react-native";
import { CText as Text,CButton as Button } from "./../customComponents";
import { AirbnbRating } from 'react-native-ratings';
import { lang } from "./../../lang";
import { request } from "./../../service";
const _ = require("lodash");

class Rate extends Component{
    state = {
        loading:false
    }
    rate = 0

    _rate = ()=>{
        const { RequestId,setTempState } = this.props
        request("POST","/api/RateServiceManToUser",{ Number:this.rate,RequestId },
            ()=>{ this.setState({ loading:true }) },
            (response)=>{
                this.setState({ loading:false },()=>{
                    if(response == "Ok") setTempState({ state:"rate",value:null });
                })
            },
            ()=>{ this.setState({ loading:false }) }
        )
    }

    render(){
        const { loading } = this.state
        const { setTempState } = this.props
        return(
            <View style={{ paddingTop:40 }}>
                <AirbnbRating
                    type='star'
                    showRating={false}
                    size={40}
                    defaultRating={this.rate}
                    onFinishRating={e=> this.rate = e}
                />
                <View style={{ flexDirection:"row",marginTop:20 }}>
                    <Button title="ثبت امتیاز" loading={loading} onPress={this._rate} containerStyle={{ flex:1 }}/>
                    <Button 
                        title="بیخیال" 
                        onPress={()=> setTempState({ state:"rate",value:null })} 
                        containerStyle={{ backgroundColor:"white",borderColor:"#D82424",borderWidth:2 }} 
                        titleStyle={{ color:"#D82424" }}
                    />
                </View>
            </View>
        )
    }
}


export default connect(null,{ setTempState })(Rate)