import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler,
    ToastAndroid,
    ImageBackground,
    StatusBar,
    Modal
} from 'react-native';
import Echarts from '../../components/native-echarts';
import {px2dp,screenH,screenW} from '../../util';
import {apiUrl} from '../../config';
import {Toast,TopView,Carousel} from '../../components/teaset';
import Video from '../../components/video';
import ImageViewer from 'react-native-image-zoom-viewer';
export default class index extends Component {
    state = {
        mapOption: {
            tooltip: {
                formatter: function(params,ticket,callback) {
                    return params.seriesName+'<br />'+params.name+'：'+params.value
                }
            },
            visualMap: {},
            geo: {
                map: 'china',
                zoom: 1.23,//视角缩放比例
                label: {
                    show: true,
                    fontSize: '6',
                    color: 'rgba(0,0,0,0.7)',
                    formatter: function(province) {
                        for(let i = 0;i<maplist.length; i++){
                            if(maplist[i].name === province.name){
                                return maplist[i].value+'';
                            }
                        }
                        return '0';
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    emphasis: {
                        areaColor: '#F3B329',//鼠标选择区域颜色
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            series: []
        },
        dataCache:{},
        dataList:[],
        maplist:[],
        videolist:null,
        data:{},
        showCard:false,
        loadingList:true,
        loadingMap:true,
        lastBackPressed:null,
        coverImgShow:false,
        coverImgIndex:0,
        maxPhotosHeight:1000
    }
    maxPhotosHeight = 0;
    componentDidMount() {
        this.props.navigation.addListener('focus',() => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        })

        this.props.navigation.addListener('blur',() => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        })

        fetch(apiUrl.maplist,{
                cache: 'no-cache'
        })
        .then((response) => response.json())
        .then(({error,data}) => {
            if(error === 0){
                let max = data.reduce((num1, num2) => {
                    return num1 > +num2.value ? num1 : +num2.value
                },0);
                max = Math.ceil(max/10)*10;
                this.setState({
                    mapOption: {
                        ...this.state.mapOption,
                        series: {
                            name: '治疗人数',
                            type: 'map',
                            geoIndex: 0,
                            data: data
                        },
                        visualMap:{
                            min: 0,
                            max: max,
                            itemGap:5,
                            left: 'left',
                            top: 'bottom',
                            inRange: {
                                color: ["#e4f8ff", "#8843f4"],
                            },
                            type:'piecewise',
                            borderWidth:1,
                            splitNumber:'4',
                            show: true
                        }
                    },
                    maplist:data,
                })
            }
        })
        .catch((error) => Toast.fail('获取地图信息出错,请稍后再试'))
        .finally(() => {
            this.setState({ loadingMap: false });
        });

        fetch(apiUrl.videolist,{
            cache: 'no-cache'
        })
        .then((response) => response.json())
        .then(({error,data}) => {
            if(error === 0){
                this.setState({
                    videolist:data
                })
            }
        })
        .catch((error) => Toast.fail('获取视频出错,请稍后再试'));
    }

    onMapClick(options){
        let {id} = options;
        let {dataCache} = this.state;
        let data;
        if(Object.keys(dataCache).includes(id)){
            data = dataCache[id][0]||{};
            this.setState({data,dataList:dataCache[id]})
        }else{
            this.setState({ loadingList: true });
            fetch(apiUrl.applylist+'?province='+options.id,{
                cache: 'no-cache'
            })
            .then((response) => response.json())
            .then(({error,data:dataList}) => {
                if(error === 0){
                    data = dataList[0]||{};
                    this.setState({dataList,data,dataCache:{...dataCache,[id]:dataList}});
                }
            })
            .catch((error) => Toast.fail('获取列表信息出错,请稍后再试'))
            .finally(() => {
                this.setState({ loadingList: false });
            });
        }
        this.maxPhotosHeight = 0;
    }

    onBackAndroid = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            BackHandler.exitApp();
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    }

    onApply(){
        this.props.navigation.navigate('Apply');
    }

    onChangeIndex(currentIndex){
        this.maxPhotosHeight = 0;
        this.setState({data:this.state.dataList[currentIndex]})
    }

    getMaxPhotosHeight(width,height,index,photosLength){
        height = (px2dp(690)/width)*height;
        if(this.maxPhotosHeight<height){
            this.maxPhotosHeight = height;
        }
        if(index === (photosLength-1)){
            this.setState({maxPhotosHeight:this.maxPhotosHeight});
        }
    }

    showCoverImg(index){
        this.setState({coverImgShow:true,coverImgIndex:index});
    }

    hideCoverImg = () => {
        this.setState({coverImgShow:false});
    }
    
    render(){
        let {mapOption,dataList,loadingList,data:{name,sex,degree,video,photos,content},maplist,showCard,loadingMap,coverImgShow,coverImgIndex,maxPhotosHeight,videolist} = this.state;
        let coverImgs = photos?photos.split(',').map((url,_i) => ({url})):[],photosLength = coverImgs.length;
        switch (+degree) {
            case 0:
                degree = '轻微';
                break;
            case 1:
                degree = '中等';
                break;
            case 2:
                degree = '严重';
                break;
            default:
                break;
        }
        const carouselItem = (imgUrl,index)=>{
            return (
                <TouchableOpacity
                    onPress={()=>{this.showCoverImg(index)}}
                    activeOpacity={1}
                    style={styles.carouselItemCover}
                    key={imgUrl}
                >
                    <Image
                        style={styles.carouselItem}
                        resizeMode='contain'
                        source={{uri:imgUrl}}
                        onLoad={({nativeEvent:{source:{width,height}}}) => {this.getMaxPhotosHeight(width,height,index,photosLength)}}
                    />
                </TouchableOpacity>
            );
        }

        const avatarItem = ({item,index})=>{
            return (
                <TouchableOpacity
                    onPress={()=>{this.onChangeIndex(index)}}
                    activeOpacity={0.8}
                >
                    <Image
                        style={styles.avatar}
                        source={{uri:item.avatar}}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <TopView>
            <StatusBar backgroundColor="#49b8fe"/>
            <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    loadingMap?(<ActivityIndicator color='#fff' style={{paddingTop:px2dp(80)}} />):(
                        <Echarts 
                            option={mapOption}
                            height={300}
                            maplist={maplist}
                            onPress={(data)=>{this.onMapClick(data)}}
                            ref={e => this.chart = e}
                        />
                    )
                }
                {videolist?(<Carousel
                    carousel={false}
                    control={true}
                    style={styles.videolist}>
                    {
                        videolist.map((val,i) => (<Video uri={val} key={i} videoBoxStyle={styles.videoItem} loadingStyle={styles.videoLoading}></Video>))
                    }
                </Carousel>):null}

                {(dataList.length>0)?
                    loadingList?(<ActivityIndicator color='#fff' style={{paddingTop:px2dp(20)}} />):(<>
                        <FlatList style={styles.avatarlist}
                            data={dataList}
                            renderItem={avatarItem}
                            keyExtractor={item => item.id}
                            horizontal={true}
                            refreshing={loadingList}
                        />

                        <View>
                            {video?<Video uri={video} videoBoxStyle={styles.videoBox}></Video>:null}
                            <Text style={styles.title}>患者信息</Text>
                            <View style={styles.table}>
                                <View style={styles.tableLabelBox}>
                                    <Text style={styles.tableLabel}>姓名</Text>
                                    <Text style={styles.tableLabel}>性别</Text>
                                    <Text style={styles.tableLabel}>病情</Text>
                                </View>
                                <View style={styles.tableValueBox}>
                                    <Text style={styles.tableValue}>{name}</Text>
                                    <Text style={styles.tableValue}>{+sex?'男':'女'}</Text>
                                    <Text style={styles.tableValue}>{degree}</Text>
                                </View>
                            </View>
                            {photosLength?(<>
                            <Text style={styles.title}>过往病历</Text>
                            <Carousel
                                interval={5000}
                                carousel={!coverImgShow}
                                style={{...styles.carousel,height:maxPhotosHeight}}>
                                {
                                    (photos||'').split(',').map((val,i) => carouselItem(val,i))
                                }
                            </Carousel>
                            </>):null}

                            {content?(<>
                            <Text style={styles.title}>康复过程</Text>
                            <Text style={styles.content}>{content}</Text>
                            </>):null}
                            
                        </View>
                        </>
                    ):null}
                <TouchableOpacity onPress={()=>{this.onApply()}} style={styles.apply} activeOpacity={0.8} >
                    <ImageBackground source={require("../../imgs/btnbg1.png")} style={styles.btnBg}>
                        <Text style={styles.applyText}>申请加入</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </ScrollView>
            </SafeAreaView>
                {coverImgShow?
                (<Modal visible={true}
                    transparent={true}
                    onRequestClose={this.hideCoverImg}>
                <ImageViewer imageUrls={coverImgs} index={coverImgIndex} onClick={this.hideCoverImg}/>
            </Modal>):null}
            </TopView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#49b8fe'
    },
    title: {
        fontSize: px2dp(36),
        textAlign:'center',
        marginBottom:px2dp(38),
        color:'#fff'
    },
    videolist:{
        height:px2dp(390),
        margin:px2dp(30),
        backgroundColor:'#000',
        borderRadius:px2dp(20),
        justifyContent:'center',
        overflow:'hidden'
    },
    videoItem:{
        flex:1
    },
    videoLoading:{
        marginTop:px2dp(160)
    },
    avatarlist:{
        margin:px2dp(30)
    },
    avatar:{
        width: px2dp(110),
        height: px2dp(110),
        borderRadius:px2dp(55),
        marginRight:px2dp(35)
    },
    apply:{
        height:px2dp(100),
        borderRadius:px2dp(20),
        margin:px2dp(30),
        justifyContent:'center'
    },
    videoBox:{
        flex:1,
        minHeight:10,
        marginHorizontal:px2dp(30),
        borderRadius:px2dp(20),
        overflow:'hidden',
        marginBottom:px2dp(40)
    },
    applyText:{
        color:'#fff',
        textAlign:'center',
        fontSize: px2dp(36)
    },
    table:{
        marginHorizontal:px2dp(30),
        marginBottom:px2dp(40),
        backgroundColor:'#d3f3fe',
        borderRadius:px2dp(20),
        paddingBottom:px2dp(30)
    },
    tableLabelBox:{
        flexDirection:'row'
    },
    tableLabel:{
        flex:1,
        textAlign:'center',
        color: '#676e97',
        marginVertical:px2dp(30)
    },
    tableValueBox:{
        flexDirection:'row'
    },
    tableValue:{
        flex:1,
        textAlign:'center',
        color: '#1b6ab4',
        fontSize:px2dp(36)
    },
    carousel:{
        height:px2dp(1000),
        marginHorizontal:px2dp(30),
        marginBottom:px2dp(40),
        overflow:'hidden',
        backgroundColor:'#d3f3fe',
        borderRadius:px2dp(20),
        justifyContent:'center',
        
    },
    carouselItemCover:{
        width:'100%',
        flex:1,
    },
    carouselItem:{
        width:'100%',
        flex:1,
    },
    content:{
        marginHorizontal:px2dp(30),
        backgroundColor:'#d3f3fe',
        borderRadius:px2dp(20),
        padding:px2dp(36),
        color: '#1b6ab4',
        fontSize:px2dp(30),
        lineHeight:px2dp(50)
    },
    btnBg:{
        flex:1,
        resizeMode: "cover",
        justifyContent: "center",
        borderRadius:px2dp(20),
        overflow:'hidden'
    }
});

AppRegistry.registerComponent('index', () => index);