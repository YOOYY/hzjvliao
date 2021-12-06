<template>
	<view class="container">
		<view class="form">
			<view class="formRow">
				<text class="formLabel">姓名</text>
				<input class="formValue" type="text" v-model="name"/>
			</view>
			<view class="formRow">
				<text class="formLabel">性别</text>
				<picker @change="bindPickerChange($event,'sex')" :value="sex" :range="sexList" range-key="text" class="picker">
					<view class="formValue">{{sexList[sex]?sexList[sex].text:''}}</view>
				</picker>
			</view>
			<view class="formRow">
				<text class="formLabel">病情</text>
				<picker @change="bindPickerChange($event,'degree')" :value="degree" :range="degreeList" range-key="text" class="picker">
					<view class="formValue">{{degreeList[degree]?degreeList[degree].text:''}}</view>
				</picker>
			</view>
			<view class="formRow">
				<text class="formLabel">地区</text>
				<picker @change="bindPickerChange($event,'provinceIndex')" :value="provinceIndex" :range="provinceList" range-key="name" class="picker">
					<view class="formValue">{{provinceList[provinceIndex]?provinceList[provinceIndex].name:''}}</view>
				</picker>
			</view>
			<view class="formRow">
				<text class="formLabel">联系电话</text>
				<input class="formValue" type="number" v-model="tel"/>
			</view>
			<textarea placeholder-style="color:#6886b4" placeholder="病情康复过程描述" v-model="content" class="content"/>
			<view class="formRow">
				<button class="upfileAvatar" @click="upfileAvatar">上传头像</button>
				<image :src="avatar.uri" v-show="avatar.uri" class="avatarImage"></image>
			</view>
		</view>
		<view class="tipsBox">
		    <view class="tipsTitle">提示</view>
		    <view class="tips">1.表格选项为必填项，图片与视频为可选项</view>
		    <view class="tips">2.图片格式为png或jpg,最大2M，最多5张，视频格式为MP4,最大80M,最多1个</view>
		    <view class="tips">3.正在审核中的信息最多为3条</view>
		    <view class="tips">4.申请信息联系电话:400-960-6066</view>
		</view>
		<button class="button" @click="upfilePhotos">上传病例图片</button>
		
		<swiper class="swiper" circular indicator-dots v-show="photos && photos.length>0">
			<swiper-item v-for="(photo,index) in photos" :key="index" @click="imageClick(photo.uri)">
				<image :src="photo.uri" mode="aspectFit" class="photo"></image>
			</swiper-item>
		</swiper>
		
		<button class="button" @click="upfileVideo">上传视频</button>
		
		<video :src="video.uri" object-fit="cover" v-show="video.uri" class="videoBox"></video>
		<button class="button button2" @click="doApply">提交申请</button>
	</view>
</template>

<script>
	import {apiUrl} from '@/config';
	export default {
		data() {
			return {
				name:'',
				sex:-1,
				degree:-1,
				provinceIndex:-1,
				tel:'',
				content:'',
				avatar:{},
				photos:[],
				video:{},
				sexList:[{text:'女'},{text:'男'}],
				degreeList:[{text:'轻微'},{text:'中等'},{text:'严重'}],
				provinceList:[],
				photoMime:['image/jpeg','image/png','jpeg','png'],
				videoMime:['video/mp4']
			}
		},
		onLoad: function() {
			this.remain = uni.getStorageSync('account').remain;
			if(this.remain<=0){
				uni.showToast({
					icon:'none',
					title: '审核中的条目最多为3条，请等待申请结果'
				})
			}
			uni.request({
				url:apiUrl.maplist,
				success:({data:{error,data}}) => {
					if(error === 0){
						this.provinceList = data;
					}else{
						uni.showToast({
							icon:'none',
							title: '获取地图信息失败,'+data
						})
					}
				},
				fail:(error) => uni.showToast({
					icon:'none',
					title: '登录失败,'+error
				})
			})
		},
		onHide:function(){
			uni.setStorage({
				key:'remain',
				data:this.remain
			});
		},
		methods: {
			bindPickerChange: function(e,prop) {
				this[prop] = e.detail.value
			},
			upfileAvatar:function(){
				uni.chooseImage({
				    count: 1,
					crop:{
						width:100,
						height:100
					},
				    success:({tempFiles}) => {
						let avatar = tempFiles[0];
						let {type,size,path} = avatar;
						uni.getImageInfo({
							src: path,
							success:(image) => {
								if(image.type){
									type = image.type;
								}
								if(!this.photoMime.includes(type)){
									uni.showToast({icon:'none',title: '头像格式不符合要求!'})
								    return;
								}
								if(size > 2*1024*1024){
									uni.showToast({icon:'none',title: '图片过大!'})
								    return;
								}
								this.avatar = {uri:path,name:'avatar',file:avatar};
							}
						});
				    }
				});
			},
			imageClick:function(url){
				let photosUrl = this.photos.map(val=>val.uri);
				let current = photosUrl.indexOf(url);
				uni.previewImage({
					urls: photosUrl,
					current
				});
			},
			upfilePhotos:function(){
				uni.chooseImage({
				    count: 5,
					sizeType:['compressed'],
				    success:({tempFiles}) => {
						let flag = true,last = tempFiles.length-1;
						tempFiles.forEach((photo,i)=>{
							let {type,size,path} = photo;
							uni.getImageInfo({
								src: path,
								success: (image) => {
									if(!flag){
										return;
									}
									if(image.type){
										type = image.type;
									}
									if(!this.photoMime.includes(type)){
										uni.showToast({icon:'none',title: '第'+ (i+1) +'图片格式不符合要求!'});
										flag = false;
									    return;
									}
									if(size > 2*1024*1024){
										uni.showToast({icon:'none',title: '第'+ (i+1) +'图片过大!'});
										flag = false;
									    return;
									}
									if((i === last) && flag){
										this.photos = tempFiles.map(val=>({uri:val.path,name:'photos[]',file:val}));
									}
								}
							});
						})
				    }
				});
			},
			upfileVideo:function(){
				uni.chooseVideo({
					count: 1,
				    success:({tempFilePath,size,tempFile}) => {
						let type;
						if(tempFile){
							type = tempFile.type;
						}
						uni.getVideoInfo({
							src: tempFilePath,
							success:(video) => {
								if(video.type){
									type = video.type;
								}
								if(!this.videoMime.includes(type)){
									uni.showToast({icon:'none',title: '视频格式不符合要求!'})
								    return;
								}
								if(size > 80*1024*1024){
									uni.showToast({icon:'none',title: '视频过大!'})
								    return;
								}
								this.video = {uri:tempFilePath,name:'video',file:tempFile};
							}
						});
				    }
				});
			},
			doApply:function(){
				if(this.remain<=0){
					uni.showToast({icon:'none',title: '审核中的条目最多为3条，请等待申请结果'});
					return;
				}
				
				let province = this.provinceList[this.provinceIndex]? this.provinceList[this.provinceIndex].id : null;
				if(!this.name || (this.sex == -1) || (this.degree == -1) || !province || !this.tel || !this.content || !this.avatar.uri){
					uni.showToast({icon:'none',title: '请填写完整表单!'});
					return;
				}
				if(!(/[\d\-\+]+/.test(this.tel))){
					uni.showToast({icon:'none',title: '请填写正确手机号!'});
					return;
				}
				let uploadArr = [this.avatar],
					formData = {
						type: 'apply',
						name:this.name,
						sex:this.sex,
						degree:this.degree,
						province:province,
						tel:this.tel,
						content:this.content,
						time:(new Date()).valueOf(),
						avatar:JSON.stringify({size:2*1024*1024,mime:this.photoMime})
					};
				if(this.photos.length>0){
					this.photos.forEach(val=>{
						uploadArr.push(val);
					})
					formData['photos'] = JSON.stringify({size:2*1024*1024,mime:this.photoMime});
				}
						
				if(this.video.uri){
					uploadArr.push(this.video);
					formData['video'] = JSON.stringify({size:8*1024*1024,mime:this.videoMime});
				}
				
				uni.uploadFile({
					url: apiUrl.apply,
					files:uploadArr,
					formData:formData,
					success: (uploadFileRes) => {
						this.remain = this.remain - 1;
						uni.showToast({title: '提交成功!详情请联系电话:188888888'});
						this.name = '';
						this.sex = -1;
						this.degree = -1;
						this.provinceIndex = -1;
						this.tel = '';
						this.content = '';
						this.avatar = {};
						this.photos = [];
						this.video = {};
					},
					fail:(error) => uni.showToast({icon:'none',title: '表单提交失败,'+error})
				});
			},
			onBack:function(){
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color:#49b8fe;
	}
	
    .form {
        padding:30rpx 40rpx;
        margin:40rpx 30rpx 0 30rpx;
        border-radius:30rpx;
        background-color:#b1e5fc;
    }
	
    .formRow {
		display: flex;
		justify-content: space-between;
		align-items:center;
        margin-bottom:20rpx;
    }
	
    .formLabel{
        font-size:30rpx;
		line-height: 66rpx;
        color:#1b6ab4;
        margin-right:30rpx;
        height:66rpx;
    }
	
    .formValue {
        flex:1;
        height: 66rpx;
		line-height: 66rpx;
        font-size:30rpx;
        color:#6886b4;
        background-color:#fff;
        border-radius:20rpx;
        padding:0 30rpx;
    }
	
	.picker{
		flex: 1;
	}
	
    .content{
		width: 570rpx;
        height: 220rpx;
        padding:20rpx;
        color:#6886b4;
        font-size:30rpx;
        border-radius:20rpx;
        background-color:#fff;
    }
	
    .upfileAvatar{
        width:160rpx;
        height:60rpx;
		line-height: 60rpx;
		font-size:30rpx;
		color:#fff;
        background-color:#00a3ff;
        border-radius:20rpx;
		margin:30rpx 0 0 0;
		padding: 0;
    }
	
    .avatarImage{
		width:66rpx;
        height: 66rpx;
		margin: 30rpx 30rpx 0 0;
    }
	
    .tipsBox{
        margin:30rpx;
		font-size:30rpx;
    }
	
    .tips{
        color:#fff;
    }
	
    .tipsTitle{
        color:#fff;
    }
	
	.button {
		width:690rpx;
	    height:100rpx;
		color:#fff;
		line-height: 100rpx;
	    border-radius:20rpx;
		font-size:36rpx;
		background-image: url(@/static/imgs/btnbg1.png);
		background-size: cover;
		margin-bottom: 40rpx;
	}
	
	.button2 {
		background-image: url(/static/imgs/btnbg2.png);
	}
	
    .videoBox{
        width: 690rpx;
        margin: 0 30rpx 30rpx 30rpx;
        border-radius:20rpx;
        overflow:hidden;
    }
	
    .swiper{
        width:690rpx;
        height:600rpx;
        margin:0 30rpx 40rpx 30rpx;
        background-color:#d3f3fe;
        border-radius:20rpx;
    }
	.photo{
		width: 100%;
		height:600rpx;
	}
</style>
