import Vue from 'vue'
import Vuex from '../store/'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
        path: '/',
        name: 'index',
        component: () => import( /* webpackChunkName: "index" */ '../views/Index.vue'),
        children: [{
                path: '/admin',
                name: 'admin',
                component: () => import( /* webpackChunkName: "admin" */ '../views/Admin.vue')
            },
            {
                path: '/video',
                name: 'video',
                component: () => import( /* webpackChunkName: "video" */ '../views/Video.vue')
            },
            {
                path: '/maplist',
                name: 'maplist',
                component: () => import( /* webpackChunkName: "maplist" */ '../views/Maplist.vue')
            },
            {
                path: '/userlist',
                name: 'userlist',
                component: () => import( /* webpackChunkName: "userlist" */ '../views/User.vue')
            },
            {
                path: '/apply',
                name: 'apply',
                component: () => import( /* webpackChunkName: "apply" */ '../views/Apply.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== "login" && Vuex.state.admin.id === -1) {
        next({
            name: "login"
        })
    } else {
        next();
    }
})
export default router;