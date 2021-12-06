import Vue from 'vue'
import Vuex from 'vuex'
import Axios from '../common/axios.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        website: 'http://www.edumallgh.com:8081',
        title: '后台管理系统',
        admin: {
            'id': -1,
            'nickName': '管理员',
            'userimg': '/static/img/user.jpg'
        },
        sideMenu: [{
                title: '账户管理',
                url: 'admin',
                icon: 'el-icon-menu'
            },
            {
                title: '审核列表',
                url: 'apply',
                icon: 'el-icon-location'
            },
            {
                title: '用户列表',
                url: 'userlist',
                icon: 'el-icon-location'
            },
            {
                title: '视频列表',
                url: 'video',
                icon: 'el-icon-location'
            },
            {
                title: '地图列表',
                url: 'maplist',
                icon: 'el-icon-location'
            }
        ]
    },
    mutations: {
        updateState(state, payload) {
            if (payload.attr) {
                state[payload.name][payload.attr] = payload.data;
            } else {
                state[payload.name] = payload.data;
            }
        },
    },
    actions: {}
})