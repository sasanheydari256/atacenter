import React, {Component} from 'react';
import { connect } from "react-redux";
import { View,ActivityIndicator } from "react-native";

class Splash extends Component{
    componentDidMount() {
        setTimeout(()=>{
            const { UserId } = this.props.configs
            if(UserId){
                this.props.navigation.replace("Main")
            }else{
                this.props.navigation.replace("Login")
            }
            
        },1000)
    }
    
    render() {
        return (
            <View>
                <ActivityIndicator color="blue"/>
            </View>
        );
    }
} 
const state = state=>({
    configs:state.configs
})

export default connect(state)(Splash)