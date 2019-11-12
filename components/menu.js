import React, { Component } from 'react';
import { connect } from "react-redux";
import { View,ScrollView,Switch,ActivityIndicator,Text } from "react-native";
import { request } from "./../service";
import { setConfigs } from "./../redux/actions/index";
class Menu extends Component{
  constructor(props){
      super(props);
      this.state = {
        activeState:true,
        changeStateLoading:false
      }

  }


    _changeState = activeState => {
        const { UserId } = this.props.configs
        request("POST","/api/IsAccessSErviceMan",{ isAccess:activeState,Serviceid:UserId },
            ()=>{ this.setState({ changeStateLoading:true }) },
            ()=>{
                this.setState({ changeStateLoading:false })
                this.props.setConfigs({ isActive:activeState });
            },
            ()=>{}
        )
    }

    render() {
        const { changeStateLoading } = this.state
        const { isActive } = this.props.configs
        return (
            <View>
                <View style={{ flexDirection:"row" }}>
                    <Switch value={isActive} onValueChange={this._changeState} style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],margin:20 }}/>
                    {changeStateLoading && <ActivityIndicator color="green"/>}
                </View>
                <View style={{ flexDirection:"row" }} >
                    <Text  style={{ fontSize: 18}}onPress={() => this.props.navigation.navigate('about')} >
                      درباره ما
                    </Text>
                </View>
                <View style={{ flexDirection:"row" }} >
                    <Text  style={{ fontSize: 18}}onPress={() => this.props.navigation.navigate('historyMyService')} >
                      تاریخچه درخواست ها
                    </Text>
                </View>
                <View style={{ flexDirection:"row" }} >
                    <Text  style={{ fontSize: 18}}onPress={() => this.props.navigation.navigate('ActiveRequest')} >
                       درخواست ها
                    </Text>
                </View>
            </View>
        );
    }
}

const state = state=>({
    configs:state.configs
})
export default connect(state,{ setConfigs })(Menu)
