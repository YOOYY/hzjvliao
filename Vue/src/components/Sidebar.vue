<template>
    <el-menu
        :default-active="sideMenu[0].url"
        background-color="#222d32"
        text-color="#b8c7ce"
        active-text-color="#fff"
        id="sidebar"
        router
    >
        <div class="logo">{{title}}</div>
        <div class="user">
            <img :src="admin['userImg']" />
            <div class="text">
                <p>{{admin['nickName']}}</p>
                <i class="success"></i>
                在线
                <i
                    class="el-icon-delete red"
                    title="注销"
                    @click="logout"
                ></i>
            </div>
        </div>

        <el-menu-item
            v-for="(item, index) in sideMenu"
            :key="index"
            :index="item.url"
        >
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    methods: {
        logout() {
            localStorage.removeItem("name");
            localStorage.removeItem("password");
            this.$router.push({ name: "login" });
        }
    },
    computed: {
        ...mapState(["title", "admin", "sideMenu"])
    }
};
</script>

<style lang='scss'>
#sidebar {
    height: 100%;
    border: 0;

    .logo {
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        font-weight: bold;
        color: white;
        background-color: #15a589;
    }
    .user {
        overflow: hidden;
        img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            padding: 10px;
            float: left;
        }
        .text {
            float: left;
            margin-left: 20px;
            color: white;
            font-size: 13px;
            p {
                margin: 8px 0 4px 6px;
                padding: 3px 0;
            }
            .red {
                margin-left: 3px;
                color: #aaa;
                cursor: pointer;
            }
        }
        .success {
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #18bc9c;
            margin: 4px 5px;
            float: left;
        }
    }
    .is-active {
        background: #1e282c !important;
        border-left: #18bc9c 4px solid;
    }
    .el-submenu {
        border-left: none;
    }
}
</style>
