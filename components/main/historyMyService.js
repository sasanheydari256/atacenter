import React, { Component } from 'react';
import { connect } from "react-redux";
import { setRequest,removeRequest,clearRequest,setTempState } from "./../../redux/actions/index";
import { FlatList,TouchableOpacity,View,ActivityIndicator } from "react-native";
import { CText as Text,CButton as Button } from "./../customComponents";
import EStyleSheet from "react-native-extended-stylesheet";
import Container from "./../container";
import ActiveRequest from './activeRequest';
import Rate from "./rate";
import { init } from "./../../notificationHandler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { lang } from "./../../lang";
import { EnToFa,ToPrice } from "./../../mixin";
import { request } from "./../../service";
const _ = require("lodash");
class Item extends Component{
    render() {
        const { Address,Rate,Price,UserName,CategoryService,RequestId } = this.props
        return (
            <TouchableOpacity style={styles.itemContainer}>
                    <Text style={[styles.txt,styles.serviceName]}>امتیاز: {EnToFa(Rate)}</Text>
                <Text>مبلغ: {`${EnToFa(ToPrice(Price))} `}</Text>
                <View style={{ flexDirection:"row",justifyContent:"center" }}>
                    <Text style={{marginTop: 5}}>{EnToFa(UserName)}</Text>
                </View>
                <Text >خدمات انجام شده: {`${EnToFa(ToPrice(CategoryService))} `}</Text>
                <Text style={[styles.txt]} numberOfLines={5}>{EnToFa(Address)}</Text>
            </TouchableOpacity>
        );
    }
}

class historyMyService extends Component{
  constructor(props){
      super(props);
      this.state = {
        strings:{},
        dataRequestMan:[]
      }

  }


    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = {
                ...langs.main,
                ...langs.globals
            };
            this.setState({ strings })
        } catch (error) {

        }
        init();
        this._getList();
    }
    _getList = ()=>{
      alert('sss')
        request("POST","/api/Listcenterservice",{"serviceid":this.props.configs.UserId},
            ()=>{},
            (response)=>{
            this.setState({dataRequestMan:response});
            // console.log(this.props.configs.UserId);
            },
            (response)=>{
            console.log("error getlist");
            }
        )
    }

    render() {

        return (
            <Container showMenu title="تاریخچه" >

                    <FlatList
                        data={this.state.dataRequestMan}
                        renderItem={({item})=> <Item { ...item } />}
                        keyExtractor={(item)=> item.RequestId}
                        style={{ height: "100%" }}
                        contentContainerStyle={{ justifyContent:"flex-start",alignItems:"stretch",paddingBottom: 10, }}
                        // onRefresh={this._getList}
                        // refreshing={loading}
                        horizontal={false}
                        alwaysBounceVertical={true}
                    />
            </Container>
        );
    }
}

const styles = EStyleSheet.create({
    itemContainer:{ margin:"10rem",marginVertical:0,marginTop:"10rem",backgroundColor:"white",padding:"10rem",borderRadius:"5rem",borderColor:"$lightBlueColor",borderWidth:"1rem" },
    btn:{ flex:1,borderRadius:3,padding:0 }
})

const mapStateToProps = (state) => {
  return { configs: state.configs };
};

export default connect(mapStateToProps)(historyMyService)
