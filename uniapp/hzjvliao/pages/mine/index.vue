<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<button class="button" @click="loginout">退出登录</button>
	</view>
</template>

<script>
	import {apiUrl} from '../../config';
	export default {
		data() {
			return {
				
			}
		},
		onLoad(){
			uni.getSystemInfo({
				success:(res)=>{
					this.windowHeight = res.windowHeight;
				}
			})
		},
		methods: {
			loginout:function(){
				uni.request({
					url:apiUrl.loginout,
					success:({data:{error,data}}) => {
						if(error === 0){
							uni.removeStorage({
							    key: 'account'
							});
							uni.redirectTo({
							    url: '/pages/login/index'
							});
						}else{
							uni.showToast({
								icon:'none',
								title: '退出登录失败,请稍后再试'
							})
						}
					},
					fail:(error) => uni.showToast({
						icon:'none',
						title: '退出登录失败,请稍后再试'+error
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color:#49b8fe;
		padding: 30rpx;
	}
	.button {
		width:600rpx;
	    height:100rpx;
		color:#fff;
		line-height: 100rpx;
	    border-radius:20rpx;
		font-size:36rpx;
		background-image: url(@/static/imgs/btnbg1.png);
		background-size: cover;
		margin: 0 40rpx;
	}
</style>
