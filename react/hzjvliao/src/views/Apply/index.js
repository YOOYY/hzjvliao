import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    StatusBar,
    Keyboard,
    AsyncStorage
} from 'react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
import * as videoPicker from 'react-native-image-picker';
import {Toast,TopView,Select,Carousel} from '../../components/teaset';

import Video from '../../components/video';
import {px2dp} from '../../util';
import Mimer from 'mimer';
import {apiUrl} from '../../config';

export default class index extends Component {
    state = {
        name:'',
        sex:'',
        degree:'',
        province:'',
        tel:'',
        content:'',
        avatar:'',
        photos:null,
        video:null,
        sexList:[{text:'男',value:1},{text:'女',value:0},{text:'未知',value:2}],
        degreeList:[{text:'轻微',value:0},{text:'中等',value:1},{text:'严重',value:2}],
        provinceList:[],
        maxPhotosHeight:1000
    }
    remain = 3;
    maxPhotosHeight = 0;
    photosLength = 0;
    photoMime = ['image/jpeg','image/png'];
    videoMime = ['video/mp4'];
    componentDidMount() {
        AsyncStorage.getItem('remain',(err,res)=>{
            this.remain = res;
            if(this.remain<=0){
                Toast.fail('审核中的条目最多为3条，请等待申请结果');
            }
        })
        fetch(apiUrl.maplist,{
            cache: 'no-cache'
        })
        .then((response) => response.json())
        .then(({error,data}) => {
            if(error === 0){
                this.setState({
                    provinceList:data
                })
            }
        })
        .catch((error) => Toast.fail('获取省份列表出错,请稍后再试'));
        Keyboard.addListener(
            'keyboardDidHide',
            ()=>{
                Keyboard.dismiss();
            }
        );
    }

    getMaxPhotosHeight(width,height,index){
        height = (px2dp(690)/width)*height;
        if(this.maxPhotosHeight<height){
            this.maxPhotosHeight = height;
        }
        if(index === (this.photosLength-1)){
            this.setState({maxPhotosHeight:this.maxPhotosHeight});
        }
    }

    doApply(){
        if(this.remain<=0){
            Toast.fail('审核中的条目最多为3条，请等待申请结果');
            return;
        }
        var formData = new FormData();
        let {name,sex,degree,province,tel,content,avatar,photos,video} = this.state;
        if(!name || (sex == null) || (degree == null) || !province || !tel || !content || !avatar){
            Toast.fail('请填写完整表单!');
            return;
        }
        if(!(/[\d\-\+]+/.test(tel))){
            Toast.fail('请填写正确手机号!');
            return;
        }
        let avatarMime = (Mimer(avatar).split('/')[1] == 'jpeg')?'jpg':Mimer(avatar).split('/')[1];
        formData.append('type', 'apply');
        formData.append('name', name);
        formData.append('sex', sex);
        formData.append('degree', degree);
        formData.append('province', province);
        formData.append('tel', tel);
        formData.append('content', content);
        formData.append('time', (new Date()).valueOf());
        formData.append('avatar', { uri: avatar, type: Mimer(avatar), name: ('avatar.'+avatarMime) });
        formData.append('avatar', JSON.stringify({size:2*1024*1024,mime:this.photoMime}));

        if(photos){
            for(var i = 0;i<photos.length;i++){
                let photo = photos[i],
                    type = Mimer(photo.uri),
                    name = 'photos'+i+'.'+type.split('/')[1],
                    file = {uri: photo.uri, type, name};
                formData.append("photos[]",file);
            }
            formData.append('photos', JSON.stringify({size:2*1024*1024,mime:this.photoMime}));
        }

        if(video){
            formData.append('video', { uri: video,type:'video/mp4',name:'video.mp4' });
            formData.append('video', JSON.stringify({size:8*1024*1024,mime:this.videoMime}));
        }

        fetch(apiUrl.apply, {
            method: 'POST',
            headers: {
                'Content-Type':'multipart/form-data'
            },
            cache: 'no-cache',
            body: formData
        })
        .then(response => response.text())
        .then(response =>{
            this.remain--;
            Toast.success('提交成功!详情请联系电话:188888888');
            this.setState({
                name:'',
                sex:'',
                degree:'',
                province:'',
                tel:'',
                content:'',
                avatar:'',
                photos:null,
                video:null
            })
        })
        .catch(error => Toast.fail('表单提交失败!'+error));
    }

    onBack(){
        this.props.navigation.navigate('Index')
    }

    render() {
        const carouselItem = (imgUrl,index)=>{
            return (
                <Image
                    style={styles.carouselItem}
                    resizeMode='contain'
                    source={{uri:imgUrl}}
                    key={imgUrl}
                    onLoad={({nativeEvent:{source:{width,height}}}) => {this.getMaxPhotosHeight(width,height,index)}}
                />
            );
        }
        let {name,content,tel,avatar,photos,video,sex,sexList,degree,degreeList,province,provinceList,maxPhotosHeight} = this.state;

        return (
            <TopView>
            <StatusBar backgroundColor="#49b8fe"/>
            <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>姓名</Text>
                        <TextInput style={styles.formValue} clearButtonMode='while-editing' value={name} onChangeText={name => this.setState({name})} returnKeyType="done"/>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>性别</Text>
                        <Select
                            style={styles.formSelect}
                            valueStyle={styles.formSelectValue}
                            iconTintColor={'#6886b4'}
                            value={sex}
                            items={sexList}
                            getItemValue={(item, index) => item.value}
                            getItemText={(item, index) => item.text}
                            pickerTitle='性别'
                            onSelected={(item, index) => this.setState({sex: item.value})}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>病情</Text>
                        <Select
                            style={styles.formSelect}
                            valueStyle={styles.formSelectValue}
                            iconTintColor={'#6886b4'}
                            value={degree}
                            items={degreeList}
                            getItemValue={(item, index) => item.value}
                            getItemText={(item, index) => item.text}
                            pickerTitle='病情'
                            onSelected={(item, index) => this.setState({degree: item.value})}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>地区</Text>
                        <Select
                            style={styles.formSelect}
                            valueStyle={styles.formSelectValue}
                            iconTintColor={'#6886b4'}
                            value={province}
                            items={provinceList}
                            getItemValue={(item, index) => item.id}
                            getItemText={(item, index) => item.name}
                            pickerTitle='地区'
                            onSelected={(item, index) => this.setState({province: item.id})}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>联系电话</Text>
                        <TextInput style={styles.formValue} value={tel} keyboardType='numeric' onChangeText={tel => this.setState({tel})} returnKeyType="done"/>
                    </View>
                    <TextInput
                        style={styles.content}
                        placeholder='病情康复过程描述'
                        multiline = {true}
                        value={content}
                        onChangeText={content => this.setState({content})}
                        returnKeyType="done"
                        blurOnSubmit
                    />
                    <View style={styles.formRow}>
                    <TouchableOpacity
                        style={styles.upfileAvatar} 
                        activeOpacity={1}
                        onPress={() =>{
                            SyanImagePicker.asyncShowImagePicker({isCrop:true,imageCount:1})
                            .then(photos => {
                                let avatar = photos[0],type = Mimer(avatar.uri);
                                if(!this.photoMime.includes(type)){
                                    Toast.fail('头像格式不符合要求!');
                                    return;
                                }
                                if(avatar.size > 2*1024*1024){
                                    Toast.fail('图片过大!');
                                    return;
                                }
                                this.setState({avatar:avatar.uri})
                            })
                            .catch(({message}) => {
                                if(message == '取消'){
                                    return;
                                }
                                Toast.fail('选择头像失败');
                            })
                        }}
                    >
                        <Text style={styles.avatarButtonText}>上传头像</Text>
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.avatarText}>{avatar.split('/').pop()}</Text>
                    </View>
                </View>
                <View style={styles.tipsBox}>
                    <Text style={styles.tipsTitle}>提示</Text>
                    <Text style={styles.tips}>1.表格选项为必填项，图片与视频为可选项</Text>
                    <Text style={styles.tips}>2.图片格式为png或jpg,最大2M，最多5张，视频格式为MP4,最大8M,最多1个</Text>
                    <Text style={styles.tips}>3.正在审核中的信息最多为3条</Text>
                    <Text style={styles.tips}>4.申请信息联系电话:188888888</Text>
                </View>
                <TouchableOpacity
                    style={styles.button1} 
                    activeOpacity={1}
                    onPress={() =>{
                        SyanImagePicker.asyncShowImagePicker({isCrop:false,imageCount:5})
                        .then(photos => {
                            let flag = true;
                            photos.forEach((photo,i)=>{
                                let type = Mimer(photo.uri);
                                if(!this.photoMime.includes(type)){
                                    Toast.fail('第'+ (i+1) +'图片格式不符合要求!');
                                    flag = false;
                                    return;
                                }
                                if(photo.size > 2*1024*1024){
                                    Toast.fail('第'+ (i+1) +'图片过大!');
                                    flag = false;
                                    return;
                                }
                            })
                            if(!flag) photos = null;
                            this.setState({photos})
                            this.photosLength = photos.length;
                        })
                        .catch(({message}) => {
                            if(message == '取消'){
                                return;
                            }
                            Toast.fail('选择图片失败');
                        })
                    }}
                >
                    <ImageBackground source={require("../../imgs/btnbg1.png")} style={styles.btnbg}>
                        <Text style={styles.buttonText}>上传病例图片</Text>
                    </ImageBackground>
                </TouchableOpacity>
                {
                    photos?<Carousel
                    interval={5000}
                    control={true}
                    style={{...styles.carousel,height:maxPhotosHeight}}>
                    {
                        photos.map((val,i) => carouselItem(val.uri,i))
                    }
                </Carousel>:null
                }
                
                <TouchableOpacity
                    style={styles.button1} 
                    activeOpacity={1}
                    onPress={() =>{
                        videoPicker
                        .launchImageLibrary({
                            mediaType: "video",
                        },({didCancel,assets}) => {
                            if(didCancel){
                                return;
                            }
                            let video = assets[0],
                                type = Mimer(video.uri);
                            if(video.type){
                                Toast.fail('请选择视频格式!');
                                return;
                            }
                            // if(!this.videoMime.includes(type)){
                            //     Toast.fail('视频格式不符合要求!');
                            //     return;
                            // }
                            if(video.fileSize > 8*1024*1024){
                                Toast.fail('视频过大!');
                                return;
                            }
                            this.setState({video:video.uri});
                        })
                    }}
                >
                    <ImageBackground source={require("../../imgs/btnbg1.png")} style={styles.btnbg}>
                    <Text style={styles.buttonText}>选择视频</Text>
                    </ImageBackground>
                </TouchableOpacity>

                {video?<Video uri={video} videoBoxStyle={styles.videoBox}></Video>:null}

                <TouchableOpacity onPress={()=>{this.doApply()}} style={styles.button2} activeOpacity={0.8} >
                    <ImageBackground source={require("../../imgs/btnbg2.png")} style={styles.btnbg}>
                    <Text style={styles.buttonText}>提交申请</Text>
                    </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{this.onBack()}} style={{...styles.button2,marginBottom:px2dp(40)}} activeOpacity={0.8} >
                    <ImageBackground source={require("../../imgs/btnbg2.png")} style={styles.btnbg}>
                    <Text style={styles.buttonText}>返回首页</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </ScrollView>
            </SafeAreaView>
            </TopView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#49b8fe'
    },
    form:{
        paddingHorizontal:px2dp(40),
        marginTop:px2dp(40),
        paddingVertical:px2dp(30),
        marginHorizontal:px2dp(30),
        borderRadius:px2dp(30),
        backgroundColor:'#b1e5fc'
    },
    formRow:{
        flexDirection:'row',
        marginBottom:px2dp(20)
    },
    formLabel:{
        fontSize:px2dp(30),
        color:'#1b6ab4',
        marginRight:px2dp(30),
        height:px2dp(66),
        paddingTop:px2dp(14)
    },
    formValue:{
        flex:1,
        height: px2dp(66),
        fontSize:px2dp(30),
        color:'#6886b4',
        backgroundColor:'#fff',
        borderRadius:px2dp(20),
        paddingHorizontal:px2dp(30),
        paddingVertical:px2dp(18)
    },
    formSelect:{
        flex:1,
        height: px2dp(66),
        fontSize:px2dp(30),
        backgroundColor:'#fff',
        borderRadius:px2dp(20),
        paddingHorizontal:px2dp(30),
        paddingVertical:px2dp(18),
        borderWidth:0
    },
    formSelectValue:{
        color:'#6886b4'
    },
    content:{
        textAlignVertical:'top',
        height: px2dp(220),
        padding:px2dp(30),
        color:'#6886b4',
        fontSize:px2dp(30),
        borderRadius:px2dp(20),
        backgroundColor:'#fff'
    },
    upfileAvatar:{
        width:px2dp(160),
        height:px2dp(60),
        backgroundColor:'#00a3ff',
        marginTop:px2dp(30),
        borderRadius:px2dp(20),
        justifyContent:'center'
    },
    avatarText:{
        flex:1,
        height: px2dp(66),
        fontSize:px2dp(30),
        marginTop:px2dp(30),
        lineHeight:px2dp(66),
        color:'#6886b4',
        textAlign:'right'
    },
    avatarButtonText:{
        color:'#fff',
        fontSize:px2dp(30),
        textAlign:'center'
    },
    buttonText:{
        color:'#fff',
        fontSize:px2dp(36),
        textAlign:'center'
    },
    button1:{
        width:px2dp(690),
        height:px2dp(100),
        marginTop:px2dp(40),
        justifyContent:'center',
        marginHorizontal:px2dp(30),
    },
    button2:{
        width:px2dp(690),
        height:px2dp(100),
        marginTop:px2dp(40),
        borderRadius:px2dp(20),
        justifyContent:'center',
        marginHorizontal:px2dp(30),
    },
    btnbg:{
        flex:1,
        resizeMode: "cover",
        justifyContent: "center",
        borderRadius:px2dp(20),
        overflow:'hidden'
    },
    videoBox:{
        flex:1,
        minHeight:10,
        marginHorizontal:px2dp(30),
        borderRadius:px2dp(20),
        overflow:'hidden',
        marginVertical:px2dp(40)
    },
    carousel:{
        height:px2dp(1000),
        marginHorizontal:px2dp(30),
        marginTop:px2dp(40),
        overflow:'hidden',
        backgroundColor:'#d3f3fe',
        borderRadius:px2dp(20),
        justifyContent:'center',
        
    },
    carouselItem:{
        width:'100%',
        flex:1,
    },
    tipsBox:{
        marginHorizontal:px2dp(30),
        marginTop:px2dp(30),
    },
    tips:{
        color:'#fff'
    },
    tipsTitle:{
        color:'#fff',
        fontSize:px2dp(30)
    }
});