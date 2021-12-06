import React, { Component } from 'react'
import { View,TouchableOpacity,Image,StyleSheet,ActivityIndicator } from 'react-native'
import Video from 'react-native-video';
import {px2dp} from '../../util';

export default class index extends Component {
    player = null;
    state = {
        height:0,
        paused:true,
        loading:true
    }
    play(){
        let paused = !this.state.paused;
        this.setState({paused})
    }
    loading=(o)=>{
        this.setState(state=>({loading:true,height:0}))
    }
    poster=({naturalSize:{width,height}})=>{
        height = (px2dp(690)/width)*height;
        this.setState(state=>({paused:false}))
        this.forceUpdate(()=>{
            this.setState(state=>({paused:true,loading:false,height}))
        })
    }
    render() {
        let {paused,height,loading} = this.state;
        let {uri,videoBoxStyle = {},loadingStyle = {}} = this.props;
        return (
            <View style={videoBoxStyle}>
                {loading?(<ActivityIndicator color='#fff' style={{paddingTop:px2dp(20),...loadingStyle}} />):null}
                <Video
                    source={{uri}}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    resizeMode="contain"
                    style={{height:height,...styles.video}}
                    controlTimeout={3000}
                    paused={paused}
                    onLoadStart={this.loading}
                    onLoad={this.poster}
                />
                {!loading?<TouchableOpacity
                    onPress={()=>{this.play()}} 
                    style={styles.playBox} 
                    activeOpacity={1} 
                >
                    <Image
                        style={styles.play}
                        source={(paused ?require('../../imgs/start.png'):require('../../imgs/pause.png'))}
                    />
                </TouchableOpacity>:null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    video: {
        flex:1
    },
    playBox:{
        position:'absolute',
        right:px2dp(20),
        bottom:px2dp(20)
    },
    play:{
        width:px2dp(80),
        height:px2dp(80)
    }
});