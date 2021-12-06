import 'react-native-gesture-handler';
import React, { Component} from 'react';
import {View,Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//引入页面模块
import IndexScreen from './src/views/Index';
import ApplyScreen from './src/views/Apply';
import LoginScreen from './src/views/Login';
import {px2dp} from './src/util';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#49b8fe'
            },
            headerTintColor: '#fff',
            headerBackTitleVisible: false,
            headerTitleStyle: {
                fontSize: px2dp(36),
                alignSelf:'center'
            }
        }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '登录',headerShown:false }}/>
        <Stack.Screen name="Index" component={IndexScreen} options={{ title: '治疗人数分布图',headerLeft:null }}/>
        <Stack.Screen name="Apply" component={ApplyScreen} options={{ title: '申请加入',headerRight:(props) => (<View/>) }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;