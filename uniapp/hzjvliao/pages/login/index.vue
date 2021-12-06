<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<image class="loading" src="/static/imgs/login.jpg" v-show="loading"></image>
		<view class="topBox">
			<image class="logo" src="/static/imgs/logo.png"></image>
			<text class="logoText">欢迎,请登录</text>
		</view>
		<view class="loginBox">
			<view class="inputBox">
				<image src="/static/imgs/tel.png" mode="scaleToFill" class="icon"></image>
				<input type="number" v-model="tel" class="formValue" placeholder='请输入手机号' placeholder-class="placeholder"/>
			</view>
			<view class="inputBox">
				<image src="/static/imgs/msg.png" mode="contain" class="icon"></image>
				<input type="number" v-model="code" class="formValue" placeholder='请输入验证码' placeholder-class="placeholder"/>
				<button class="codeBtn" @click="getCode">{{timer?time+'s':'获取验证码'}}</button>
			</view>
			<button class="loginBtn" @click="login()">登陆</button>
			<button class="loginBtn wechatBtn" @click="wechatLogin">微信登陆</button>
			<button class="loginBtn appleBtn" @click="appleLogin" v-show="appleShow">
				<image src="/static/imgs/ios.png" class="apple_icon"></image>通过苹果登陆
			</button>
		</view>
	</view>
</template>

<script>
	import {apiUrl} from '../../config';
	export default {
		data() {
			return {
				tel:'',
				code:'',
				time:60,
				timer:null,
				wechatInstall:true,
				loading:false,
				appleShow:false,
				windowHeight:650
			}
		},
		onLoad: function() {
			let {type,account,password} = uni.getStorageSync('account');

			if (type == 'wechat') {
				this.wechatLogin();
			}else if(type == 'apple'){
				this.appleLogin();
			}else if(type == 'tel'){
				this.tel = account;
				this.code = true;
				this.login(password);
			}

			uni.getSystemInfo({
				success:({system,windowHeight})=>{
					this.windowHeight = windowHeight;
					let [ios,version] = system.toLowerCase().split(' ');
					if((ios=='ios') && version>13){
						this.appleShow = true;
					}
				}
			})
		},
		methods: {
			wechatLogin:function(){
				uni.login({
				  provider: 'weixin',
				  success: (loginRes) => {
				    uni.getUserInfo({
				      provider: 'weixin',
				      success: ({userInfo}) => {
						  this.loading = true;
						  uni.request({
						  	url:apiUrl.wechatlogin,
						  	method: 'POST',
						  	data: {
								userinfo:{
								  openid:userInfo.openId,
								  nickname:userInfo.nickName,
								  sex:userInfo.gender,
								  headimgUrl:userInfo.avatarUrl,
								  unionid:userInfo.unionId,
								  city:userInfo.city,
								  country:userInfo.city,
								  province:userInfo.province
								}
						  	},
						  	success:({data:{error,data}}) => {
						  		if(error === 0){
									uni.setStorage({
										key:'account',
										data:{
											type:'wechat',
											remain:data
										}
									});
						  			uni.switchTab({
						  				url: '/pages/index/index'
						  			});
						  		}else{
									this.loginfail('登录失败,'+data);
						  		}
						  	},
						  	fail:(error) => {
								this.loginfail('登录失败'+error.errMsg);
							}
						  })
				      }
				    });
				  }
				});
			},
			appleLogin:function(){
				uni.login({  
				    provider: 'apple',  
				    success: (loginRes) => {
				        uni.getUserInfo({
				            provider: 'apple',  
				            success({userInfo}) {
								this.loading = true;
								uni.request({
									url:apiUrl.applelogin,
									method: 'POST',
									data: {
										userinfo:{
											openid:userInfo.openId,
											nickname:userInfo.familyName,
											email:userInfo.email
										}
									},
									success:({data:{error,data}}) => {
										if(error === 0){
											uni.setStorage({
												key:'account',
												data:{
													type:'apple',
													remain:data
												}
											});
											uni.switchTab({
												url: '/pages/index/index'
											});
										}else{
											this.loginfail('登录失败,'+data);
										}
									},
									fail:(error) => {
										this.loginfail('登录失败,请稍后再试');
									}
								})
				            }  
				        })  
				    },  
				    fail: (error) => {  
				        this.loginfail('登录失败'+error.errMsg);
				    }  
				});  
			},
			login:function(password = ''){
				if(!this.code){
					uni.showToast({
						icon:'none',
						title: '请填写验证码'
					});
					return;
				}
				this.loading = true;
				uni.request({
					url:apiUrl.checkcode,
					method: 'POST',
					data: {
						code:this.code,
						tel:this.tel,
						password
					},
					success:({data:{error,data}}) => {
						if(error === 0){
							uni.setStorage({
								key:'account',
								data:{
									type:'tel',
									account:this.tel,
									password:data.password,
									remain:data.remain
								}
							});
							uni.switchTab({
								url: '/pages/index/index'
							});
						}else{
							this.loginfail('登录失败,'+data);
						}
					},
					fail:(error) => {
						this.loginfail('登录失败,'+error.errMsg);
					}
				})
			},
			getCode:function(){
				if(!this.tel){
					uni.showToast({
						icon:'none',
						title: '请填写手机号'
					});
					return;
				}
				uni.request({
					url:apiUrl.sendcode,
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					data:{
						tel:this.tel
					},
					success:({data:{error,data}}) => {
						if(error === 0){
							this.timer = setInterval(() => {
								this.time -= 1;
								if(this.time === 0){
									clearInterval(this.timer);
									this.time = 60;
									this.timer = null;
								}
							}, 1000);
						}else{
							uni.showToast({
								icon:'none',
								title: '获取验证码失败,'+data
							})
						}
					},
					fail:(error) => uni.showToast({icon:'none',title: '获取验证码失败,'+error.errMsg})
				})
			},
			loginfail:function(msg){
				uni.showToast({
					icon:'none',
					title: msg
				});
				uni.removeStorage({
				    key: 'account'
				});
				this.loading = false;
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		background-image:url(/static/imgs/login_bg.jpg);
		background-size: cover;
		overflow: hidden;
	}
	
	.loading{
		position: absolute;
		width:100%;
		height:100%;
		left: 0;
		top:0;
		z-index:1;
	}
	
	.topBox {
		flex: 1;
		height: 436rpx;
		width:750rpx;
		text-align: center;
	}
	
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 0 auto;
		margin-bottom: 50rpx;
		padding-top: 80rpx;
	}
	
	.logoText {
        color:#fff;
        font-size:36rpx;
    }
	
	.loginBox {
	    flex:2;
	    border-top-left-radius:30rpx;
	    border-top-right-radius:30rpx;
		background: url(/static/imgs/loginbox_bg.jpg);
		background-size: cover;
		padding: 80rpx 45rpx;
	}
	
	.inputBox {
	    height:100rpx;
	    border-radius:20rpx;
	    background-color:#fff;
		display: flex;
	    align-items:center;
	    margin-bottom:50rpx;
		overflow: hidden;
	}
	
	.icon {
	    width:50rpx;
	    height:50rpx;
		margin:0 28rpx;
	}
	
	.formValue {
	    flex:1;
	    height:100rpx;
	    font-size:30rpx;
	    color:#6886b4;
	    background-color:#fff;
	}
	
	.codeBtn {
	    width:220rpx;
	    height:70rpx;
	    background-color:#00a3ff;
		color:#fff;
		font-size:30rpx;
	    border-radius:20rpx;
		line-height: 70rpx;
		margin-right:20rpx;
	}

	.loginBtn {
		color:#fff;
	    height:88rpx;
		line-height: 88rpx;
	    border-radius:60rpx;
		font-size: 38rpx;
		background: url(/static/imgs/btnbg1.png);
		background-size: cover;
	}
	
	.wechatBtn {
		margin-top: 190rpx;
		background: #04BE02;
	}
	
	.appleBtn {
		margin-top: 30rpx;
		background: #000;
	}
	.apple_icon{
		width: 62rpx;
		height: 88rpx;
		margin-right: 10rpx;
		display: inline-block;
		vertical-align: bottom;
	}
</style>
