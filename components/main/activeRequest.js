import React, { Component } from 'react';
import { connect } from "react-redux";
import { setTempState } from "./../../redux/actions/index";
import EStyleSheet from "react-native-extended-stylesheet";
import MapView,{ Marker } from 'react-native-maps';
import { showLocation } from 'react-native-map-link';
import { widthPercentageToDP as wp ,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View,Modal,Image } from "react-native";
import { CText as Text,CButton as Button } from "./../customComponents";
import { EnToFa,ToPrice } from "./../../mixin";
import { lang } from "./../../lang";
import { request } from "./../../service";

class ActiveRequest extends Component{
    state = {
        strings:{},
        largMapModalVisible:false,
        cancelLoading:false,
        doneLoading:false,
        activeReq:[]
    }



    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = {
                ...langs.activeRequest,
                ...langs.globals
            };
            this.setState({ strings })
        } catch (error) {

        }
    }

    _goToMap = ()=>{
        // const { Lat,Long } = this.props.tempState.activeRequest
        showLocation({ latitude: Lat,longitude: Long })
    }

    _cancel = (RequestId)=>{
        request("POST","/api/CancelRequetServiceMan",{FinalId:RequestId,Description:""},
            ()=>{ this.setState({ cancelLoading:true }) },
            (response)=>{
                this.setState({ cancelLoading:false })
                switch (response) {
                    case "ok":
                        this.props.setTempState({ state:"activeRequest",value:null })
                        break;

                    default:
                        break;
                }

            },
            ()=>{ this.setState({ cancelLoading:false }) }
        )
    }

    _done = (RequestId)=>{
        const { UserId } = this.props.configs
        request("POST","/api/FinalService",{RequestId:Number.parseInt(RequestId),ServiceId:UserId},
            ()=>{ this.setState({ doneLoading:true }) },
            (response)=>{
                this.setState({ doneLoading:false })
                switch (response) {
                    case "ok":
                        this.props.setTempState({state:"rate",value:this.props.tempState.activeRequest})
                        this.props.setTempState({ state:"activeRequest",value:null })
                        break;
                    case "Error":
                        break;
                    default:
                        break;
                }

            },
            ()=>{ this.setState({ doneLoading:false }) }
        )
    }

    render() {
        const { PRICE,PRICE_UNIT,CATEGORY,ADDRESS,CANCEL,FINISH,ROUTING } = this.state.strings
        const { largMapModalVisible,cancelLoading,doneLoading } = this.state
        const { activeRequest } = this.props.tempState
        // const activeRequest = {
        //   Category:"گروه آزمایش خون پارسیان",
        //   RequestId:148,
        //   SericeManName:"سرویس",
        //   Address:" آدرس تهران خیابان بی نام" ,
        //   Price:"54000",
        //   PhoneNumber:"09179600728",
        //   Lat:35.803370,
        //   Long:51.453388
        // }
        if(activeRequest == null){
            return null
        }

        let { Category,RequestId,SericeManName,Address,Price,PhoneNumber,Lat,Long } = activeRequest
        Lat = Number.parseFloat(Lat);
        Long = Number.parseFloat(Long);
        const region = {
            latitude: Lat,
            longitude: Long,
            latitudeDelta: 0.0111,
            longitudeDelta: 0.0111
        }
        return (
            <View style={styles.container}>

                <Text style={[styles.txt]}>{`${CATEGORY}: ${Category}`}</Text>
                <Text style={[styles.txt]}>{`${PRICE}: ${EnToFa(ToPrice(Price))} ${PRICE_UNIT}`}</Text>
                <Text style={[styles.txt]}>{`${ADDRESS}: ${EnToFa(Address)}`}</Text>
                <Text style={[styles.txt]}>{`تلفن: ${EnToFa(PhoneNumber)}`}</Text>

                <View style={{ width:"100%",height:wp("60%"),alignSelf:"center",borderRadius:10,overflow:"hidden" }}>
                    <MapView
                        initialRegion={region}
                        showsUserLocation={false}
                        zoomEnabled={true}
                        zoomControlEnabled={true}
                        style={{ flex:1 }}
                        liteMode
                        onPress={()=> this.setState({ largMapModalVisible:true })}
                    >
                        <Marker
                            coordinate={{ latitude: Lat ,longitude: Long }}
                            key={"000"}
                            pinColor="#4ba7fd"
                        />
                    </MapView>
                </View>

                <View style={{ flexDirection:"row" }}>
                    <Button title={FINISH} loading={doneLoading} onPress={()=> this._done(RequestId)} containerStyle={{ flex:1 }}/>
                    <Button title={CANCEL} loading={cancelLoading} loadingColor="#D82424" onPress={()=> this._cancel(RequestId)} containerStyle={{ flex:1,backgroundColor:"white",borderColor:"#D82424",borderWidth:2 }} titleStyle={{ color:"#D82424" }}/>
                </View>

                <Modal visible={largMapModalVisible} onRequestClose={()=> this.setState({ largMapModalVisible:false })} animationType="slide">
                    <View style={{ flex:1 }}>
                        <MapView
                            initialRegion={region}
                            style={{ flex:1 }}
                            showsUserLocation
                        >
                            <Marker
                                coordinate={{ latitude: Lat ,longitude: Long }}
                                key={"000"}
                                pinColor="#4ba7fd"
                            />
                        </MapView>

                        <View style={{ position:"absolute",bottom:10 }}>
                            <Button title={ROUTING} onPress={this._goToMap}/>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container:{ margin:"10rem" },
    txt:{ fontSize:"16rem",marginVertical:"5rem" }
})

const state = state=>({
    configs:state.configs,
    tempState:state.tempState
})
export default connect(state,{ setTempState })(ActiveRequest)
