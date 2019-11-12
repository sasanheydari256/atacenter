import React, { Component } from 'react';
import { connect } from "react-redux";
import { setRequest,removeRequest,clearRequest,setTempState,setTempStateRequest } from "./../../redux/actions/reqAction";
import { getRequsets } from '../../redux/actions/reqAction';
import PropTypes from 'prop-types';

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

class Request extends Component{
  constructor(props){
      super(props);
      this.state = {
        isOpen:false,
        loading:false,
        requests:{}
      }
// console.log(this.props);
  }


    


    _accept = (RequestId)=>{
        const { configs,requests,setTempState,clearRequest,data } = this.props
        const { UserId,PID } = this.props.configs
        request("POST","/api/AcceptRequet",{ RequestId,UserId,FRequestId:_.filter(_.map(requests,r=> r.RequestId),r=> r!=RequestId),PID },
            ()=>{ this.setState({ loading:true }) },
            (response)=>{
                this.setState({ loading:false })
                switch (response) {
                    case "ok": //Accepted
                    this._afterAccept(RequestId)
                        // setTempState({ state:"activeRequest",value:data });
                        // console.log(data);
                        // clearRequest();
                        break;
                    case "Error": // Someone else accepted before
                        break;
                    default:
                        break;
                }
            },
            ()=>{ this.setState({ loading:false }) }
        )
    }

    _afterAccept = (RequestId)=>{
    //   fetch('https://jsonplaceholder.typicode.com/todos/1')
    // .then(response => response.json())
    // .then(json => this.props.setTempStateRequest(json))
    const { setTempState } = this.props

    request("POST","/api/InformationAfterAcceptRequestForServiceMan",{ RequestId},
        ()=>{  },
        (response)=>{
             setTempState({ state:"activeRequest",value:response });
             console.log(response);
        },
        ()=>{ this.setState({ loading:false }) }
    )

    }

    _cancel = (RequestId)=>{
        const { UserId } = this.props.configs
        request("POST","/api/CancelRequetServiceManFromList",{ RequestId,ServiceId:UserId },
            ()=>{ this.setState({ loading:true }) },
            (response)=>{
                this.setState({ loading:false },()=>{
                    switch (response) {
                        case "OK":
                            this.props.removeRequest(RequestId);
                            break;
                        default:
                            break;
                    }
                })
            },
            ()=>{ this.setState({ loading:false }) }
        )
    }

    render() {

        const { RequestId,Category,Price,Address } = this.props.data
        const { PRICE_UNIT,ACCEPT,CANCEL } = this.props.strings
        const { isOpen,loading } = this.state
        let secy = () =>{
          console.log(this.props.configs);
        }
        return (
            <TouchableOpacity style={styles.itemContainer} activeOpacity={7} style={styles.itemContainer} onPress={()=> this.setState({ isOpen:!isOpen })}>
                <Text>{Category}</Text>
                <Text>{`${EnToFa(ToPrice(Price))} ${PRICE_UNIT}`}</Text>
                <Text>{EnToFa(Address)}</Text>

                {isOpen && !loading &&
                    <View style={{ flexDirection:"row" }}>
                        <Button title={ACCEPT} onPress={()=> this._accept(RequestId)} containerStyle={[styles.btn]}/>

                        <Button title={CANCEL} onPress={()=> this._cancel(RequestId)} containerStyle={[styles.btn,{backgroundColor:"#CF6A4C"}]}/>
                        <Button title="test" onPress={()=> this._afterAccept(201)} containerStyle={[styles.btn,{backgroundColor:"#CF6A4C"}]}/>

                    </View>
                }
                {isOpen && loading && <ActivityIndicator style={{ marginVertical:10 }}/>}
            </TouchableOpacity>
        );
    }
}
const mapStateToProps2 = (state) => {
  return {
    configs:state.configs,
  requests:state.requests,
  tempState:state.tempState,
  reqData: state.reqData

   };
};


const ConnectedRequest = connect(mapStateToProps2,{removeRequest,clearRequest,setTempState,setTempStateRequest} )(Request)

class Main extends Component{
  constructor(props){
      super(props);
      this.state = {
        isOpen:false,
        loading:false,
        requests:{},
        strings:{}
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
        await this.props.getRequsets(this.props.configs.UserId);

    }

    _getList = ()=>{
        request("POST","/api/ListMyRequestForServiceMan",{serviceid:"15"},
            ()=>{},
            (response)=>{
              this.setState({requests:response});

              // console.log(this.props.randomPeople.people);
            },
            ()=>{}
        )
    }

    render() {
        let showCount = (obj) => {
          var size = 0, key;
          for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
          }
          return size
          // Get the size of an object
        }
        const { requests } = this.props.reqData;
        const { tempState } = this.props;
        const rate = this.props.rate == undefined ? null : this.props.rate;
        const { TITLE,PRICE_UNIT,TITLE2,TITLE3,ACCEPT,CANCEL } = this.state.strings
        const _getTitle = ()=>{
            // if(tempState.activeRequest != null) return TITLE2
            // if(tempState.rate != null) return TITLE3
            return `${TITLE} (${EnToFa(showCount(requests))})`
        }
        let secy = () =>{
          console.log(this.props.tempState);
        }
        return (

            <Container showMenu backDisabled title={_getTitle()}>
            <TouchableOpacity style={styles.buttonContainerRegister} onPress = {() => secy()}>
                                    <Text  style={styles.buttonText}>REGISTER</Text>
                                </TouchableOpacity>
          {tempState.activeRequest === null && rate === null &&
                    <FlatList
                        data={requests}
                        renderItem={({item})=> <ConnectedRequest data={item} strings={{ PRICE_UNIT,ACCEPT,CANCEL }}/>}
                        keyExtractor={(item)=> item.RequestId}
                        style={{ height: "100%" }}
                        contentContainerStyle={{ justifyContent:"flex-start",alignItems:"stretch",paddingBottom: 10, }}
                        // onRefresh={this._getList}
                        // refreshing={loading}
                        horizontal={false}
                        alwaysBounceVertical={true}
                    />
                  }
                  {tempState.activeRequest != null && <ActiveRequest/>}
                  {tempState.rate != null && <Rate {...tempState.rate}/>}
            </Container>
        );
    }
}
// Main.propTypes = {
//   fetchPeople : PropTypes.func.isRequired,
//   fetchPeople : PropTypes.object.isRequired
// };


// {tempState.activeRequest === null && tempState.rate === null &&

// {tempState.activeRequest != null && <ActiveRequest/>}
// {tempState.rate != null && <Rate {...tempState.rate}/>}
const styles = EStyleSheet.create({
    itemContainer:{ margin:"10rem",marginVertical:0,marginTop:"10rem",backgroundColor:"white",padding:"10rem",borderRadius:"5rem",borderColor:"$lightBlueColor",borderWidth:"1rem" },
    btn:{ flex:1,borderRadius:3,padding:0 }
})

const mapStateToProps = (state) => {
  return {
    configs:state.configs,
  requests:state.requests,
  tempState:state.tempState,
  reqData: state.reqData

   };
};


export default connect(mapStateToProps,{getRequsets})(Main)
