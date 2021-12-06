import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,SafeAreaView,ImageBackground,Image,TextInput,Keyboard,StatusBar,ActivityIndicator,Modal,AsyncStorage } from 'react-native';
import {Toast,TopView} from '../../components/teaset';
import * as WeChat from 'react-native-wechat';
import {apiUrl} from '../../config';
import {px2dp} from '../../util';
export default class HomeScreen extends Component {
    state = {
        tel:'',
        code:'',
        time:60,
        timer:null,
        wechatInstall:true,
        loading:false,
    }

    componentDidMount() {
        try {
            WeChat.registerApp('wx85a7fbb0bd4c6e3c');
            WeChat.isWXAppInstalled().then((res)=>{
                this.setState({wechatInstall:res})
            });
        } catch (e) {
            console.error(e);
        }
        Keyboard.addListener(
            'keyboardDidHide',
            ()=>{
                Keyboard.dismiss();
            }
        );
    }

    login(){
        let {code,tel} = this.state;
        if(!code){
            Toast.fail('请填写验证码');
            return;
        }
        fetch(apiUrl.checkcode,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                phone:tel
            })
        })
        .then((response) => response.json())
        .then(({error,data}) => {
            if(error === 0){
                AsyncStorage.setItem('remain', data);
                this.props.navigation.replace('Index');
            }else{
                Toast.fail('登录失败,'+data)
            }
        })
        .catch((error) => Toast.fail('登录失败,'+error))
    }
    getCode(){
        let {timer,time,tel} = this.state;
        if(!tel){
            Toast.fail('请填写手机号');
            return;
        }
        fetch(apiUrl.sendcode,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tel
            })
        })
        .then((response) => response.json())
        .then(({error,data}) => {
            if(error === 0){
                timer = setInterval(() => {
                    time -= 1;
                    this.setState({time});
                    if(time === 0){
                        clearInterval(timer);
                        this.setState({time:60,timer:null});
                    }
                }, 1000);
                this.setState({timer});
            }else{
                Toast.fail('获取验证码失败,'+data)
            }
        })
        .catch((error) => Toast.fail('获取验证码失败,'+error))
    }
    wechatLogin(){
        // AsyncStorage.setItem('remain', "3");
        // this.props.navigation.replace('Index');
        // return;
        if(!this.state.wechatInstall){
            Toast.fail('您未安装微信app');
            return;
        }
        this.setState({loading:true});
        WeChat.sendAuthRequest("snsapi_userinfo").then(({errCode,code})=>{
            if(errCode == 0){
                fetch(apiUrl.wechatLogin,{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code
                    })
                })
                .then((response) => response.json())
                .then(({error,data}) => {
                    if(error === 0){
                        AsyncStorage.setItem('remain', data);
                        this.props.navigation.replace('Index');
                    }else{
                        this.setState({loading:false});
                        Toast.fail('登录失败,'+data);
                    }
                })
                .catch((error) => {
                    this.setState({loading:false});
                    Toast.fail('登录失败,'+error);
                })
            }else{
                this.setState({loading:false});
            }
        });
    }
    render() {
        let {tel,code,timer,time,loading} = this.state;
        return (
            <TopView>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#3d80e6"/>
                <ImageBackground source={require("../../imgs/login_bg.jpg")} style={styles.bg}>
                    <View style={styles.topBox}>
                        <Image
                            style={styles.logo}
                            resizeMode='contain'
                            source={require("../../imgs/logo.png")}
                        />
                        <Text style={styles.logoText}>欢迎,请登录</Text>
                    </View>
                    <View style={styles.loginBox}>
                        <ImageBackground source={require("../../imgs/loginbox_bg.jpg")} style={{...styles.bg,justifyContent:'space-around'}}>
                            <View>
                                <View style={styles.inputBox}>
                                    <Image style={styles.icon} resizeMode='contain' source={require("../../imgs/tel.png")}/>
                                    <TextInput style={styles.formValue} clearButtonMode='while-editing' value={tel}
                                        onChangeText={tel => this.setState({tel})} placeholder='请输入手机号' keyboardType='numeric' placeholderTextColor='#6886b4' returnKeyType="done"/>
                                </View>
                                <View style={styles.inputBox}>
                                    <Image style={styles.icon} resizeMode='contain' source={require("../../imgs/msg.png")}/>
                                    <TextInput style={styles.formValue} clearButtonMode='while-editing' value={code}
                                        onChangeText={code => this.setState({code})} placeholder='请输入验证码' keyboardType='numeric' placeholderTextColor='#6886b4' returnKeyType="done"/>
                                    <TouchableOpacity
                                        style={styles.codeBtn} 
                                        activeOpacity={0.8}
                                        onPress={() =>this.getCode()}
                                    >
                                        <Text style={styles.codeText}>{timer?time+'s':'获取验证码'}</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.loginBtn} activeOpacity={1} onPress={() => this.login()}>
                                    <ImageBackground source={require("../../imgs/btnbg1.png")} style={styles.bg}>
                                        <Text style={styles.btnText}>登录</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.loginBtn} activeOpacity={1} onPress={() => this.wechatLogin()}>
                                <ImageBackground source={require("../../imgs/btnbg2.png")} style={styles.bg}>
                                    <Text style={styles.btnText}>微信登录</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                </ImageBackground>
                <Modal
                    animationType="none"
                    visible={loading}
                    transparent={true}
                    style={styles.loading}
                >
                    <ImageBackground source={require("../../imgs/login.jpg")} style={styles.bg}>
                    </ImageBackground>
                </Modal>
            </SafeAreaView>
            </TopView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    bg:{
        flex:1,
        resizeMode: "cover",
        justifyContent: "center",
        overflow:'hidden'
    },
    topBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    logo:{
        width:px2dp(204),
        height:px2dp(204),
        marginBottom:px2dp(50)
    },
    logoText:{
        color:'#fff',
        fontSize:px2dp(36)
    },
    loginBox:{
        flex:2,
        borderTopLeftRadius:px2dp(30),
        borderTopRightRadius:px2dp(30)
    },
    inputBox:{
        height:px2dp(100),
        borderRadius:px2dp(20),
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:px2dp(30),
        paddingHorizontal:px2dp(28),
        marginBottom:px2dp(50)
    },
    icon:{
        width:px2dp(50),
        height:px2dp(50)
    },
    formValue:{
        flex:1,
        height:px2dp(100),
        fontSize:px2dp(30),
        color:'#6886b4',
        backgroundColor:'#fff',
        borderRadius:px2dp(20),
        paddingHorizontal:px2dp(30),
        paddingVertical:px2dp(18)
    },
    codeBtn:{
        width:px2dp(220),
        height:px2dp(70),
        backgroundColor:'#00a3ff',
        borderRadius:px2dp(20),
        justifyContent:'center'
    },
    codeText:{
        color:'#fff',
        fontSize:px2dp(30),
        textAlign:'center'
    },
    loginBtn:{
        height:px2dp(100),
        borderRadius:px2dp(20),
        marginHorizontal:px2dp(30),
        justifyContent:'center',
        overflow:'hidden'
    },
    btnText:{
        color:'#fff',
        textAlign:'center',
        fontSize: px2dp(36)
    },
    loading:{
        position:'absolute',
        flex:1,
        zIndex:100
    }
})