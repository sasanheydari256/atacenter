import React, { Component } from 'react';
import { View,TouchableWithoutFeedback,Keyboard,SafeAreaView } from "react-native";
import NavHeader from "./header";
import EStyleSheet from "react-native-extended-stylesheet";

const _ = require("lodash");

class Container extends Component{
    render() {
        const { showMenu } = this.props
        const styles = EStyleSheet.create({
            lightBlueColorBG:{ backgroundColor:"$lightBlueColor" },
            innerContainer:{ flex:1,backgroundColor:"white",borderTopRightRadius:showMenu? "20rem":0,borderTopLeftRadius:showMenu? "20rem":0,...this.props.style }
        })
        return (
            <TouchableWithoutFeedback style={{ flex:1 }} onPress={Keyboard.dismiss}>
                <View style={{flex:1}}>
                    <NavHeader {..._.omit(this.props,["children","style"])}/>

                    <View style={{ flex:1,...styles.lightBlueColorBG }}>
                        <View style={styles.innerContainer}>
                            {this.props.children}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Container
