import React, {Component} from 'react';
import { connect } from "react-redux";
import { setConfigs } from "./../../redux/actions/index";
import { View,ImageBackground } from "react-native";
import Modal from "react-native-modal";
import { request } from "./../../service";
import { CText as Text,CTextInput as TextInput,CButton as Button } from "./../customComponents";
import { EnToFa,FaToEn,MobileCheck } from "./../../mixin";
import Container from "./../container";
import EStyleSheet from "react-native-extended-stylesheet";
import { lang } from "./../../lang";

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            number:"09199135976",
            numberErr:false,
            sendNumberLoading:false,

            confirmModalVisible:false,
            confirmNumber:"",
            confirmNumberErr:false,
            sendConfirmNumberLoading:false,
            strings:{}
        }

    }

    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = {
                ...langs.login,
                ...langs.globals
            };
            this.setState({ strings })
        } catch (error) {

        }
    }

    _submit = ()=>{
        const { number } = this.state
        if(MobileCheck(number)){
            this.setState({ numberErr:false ,confirmModalVisible:true})
            return
        }

        request("POST","/api/LoginServiceMan",{Phone:number},
            ()=>{ this.setState({ sendNumberLoading:true }) },
            (response)=>{
                switch (response) {
                    case "SendToActivityByPhoneForServiceMan":
                        this.setState({ sendNumberLoading:false,confirmModalVisible:true });
                        break;
                    case "Not":
                        this.setState({ sendNumberLoading:false,numberErr:true });
                        break;
                    default:
                        break;
                }
            },
            ()=>{ this.setState({ sendNumberLoading:false }); }
        )
    }

    _confirm = ()=>{
        const { number,confirmNumber } = this.state
        if(!confirmNumber){
            this.setState({ confirmNumberErr:true })
            return
        }

        request("POST","/api/ActivityService",{PhoneNumber:number,ActiveCode:confirmNumber},
            ()=>{ this.setState({ sendConfirmNumberLoading:true }) },
            (response)=>{
                switch (response) {
                    case "Mistake":
                        this.setState({ sendConfirmNumberLoading:false,confirmNumber:"",confirmNumberErr:false })
                        break;
                    default:
                        this.props.setConfigs({...response,PhoneNumber:number});
                        this.props.navigation.replace("Main");
                        break;
                }
            },
            ()=>{ this.setState({ confirmModalVisible:false }) }
        )
    }

    render() {
        const { number,numberErr,sendNumberLoading,confirmModalVisible,confirmNumber,confirmNumberErr,sendConfirmNumberLoading } = this.state
        const { RECEIVE_CODE,CONFIRM_CODE,LOGIN } = this.state.strings
        return (
            <Container showMenu={false} style={{ flex:1 }}>
                <ImageBackground source={require("./../../assets/images/loginBG.png")} style={{ flex:1,justifyContent:"center" }} resizeMode="cover">
                    <TextInput error={numberErr} placeholder='09xxxxxxxxx' keyboardType="numeric" onChangeText={val=> this.setState({number:FaToEn(val)})} value={EnToFa(number)} style={styles.textInput}/>
                    <Button title={RECEIVE_CODE} loading={sendNumberLoading} onPress={this._submit}/>
                </ImageBackground>


                <Modal
                    isVisible={confirmModalVisible}
                    onBackButtonPress={()=> this.setState({ confirmModalVisible:false })}
                    onBackdropPress={()=> this.setState({ confirmModalVisible:false })}
                >
                    <View style={styles.modalContainer}>
                        <TextInput keyboardType={"numeric"} error={confirmNumberErr} placeholder={CONFIRM_CODE} onChangeText={val=> this.setState({confirmNumber:FaToEn(val)})} value={EnToFa(confirmNumber)} style={styles.textInput}/>
                        <Button title={LOGIN} loading={sendConfirmNumberLoading} onPress={this._confirm}/>
                    </View>
                </Modal>
            </Container>
        );
    }
}

const styles = EStyleSheet.create({
    textInput:{ textAlign:"center" },
    modalContainer:{ backgroundColor:"white",padding:"19rem",borderRadius:"10rem" }
})

export default connect(null,{setConfigs})(Login)
