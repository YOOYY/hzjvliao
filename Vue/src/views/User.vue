<template>
    <div id="article">
        <v-headpanel>
            <em>用户信息列表</em>
        </v-headpanel>
        <el-input type="text" v-model="userid" placeholder="请输入id"></el-input>
        <el-button
            @click="select = true"
            style="margin:20px"
            type="danger"
            size="small"
        >查询</el-button>
        <el-select
            v-model="value"
            placeholder="选择类型"
            style="margin-left:20px"
        >
            <el-option
                v-for="(name,type) in typelist"
                :key="type"
                :label="name"
                :value="type"
            >
            </el-option>
        </el-select>

        <el-table
            :data="tableData"
            style="width: 100%"
        >
            <el-table-column
                label="ID"
                prop="id"
            >
            </el-table-column>
            <el-table-column
                label="昵称"
                prop="nickname"
            >
            </el-table-column>
            <el-table-column
                label="性别"
                prop="sex"
            >
                <template slot-scope="scope">
                    {{sexArr[scope.row.sex]}}
                </template>
            </el-table-column>
            <el-table-column
                label="省份"
                prop="province"
            >
            </el-table-column>
            <el-table-column
                label="城市"
                prop="city"
            >
            </el-table-column>
            <el-table-column
                label="国家"
                prop="country"
            >
            </el-table-column>
            <el-table-column
                label="头像"
                prop="headimgurl"
            >
                <template slot-scope="scope">
                    <img
                        :src="scope.row.headimgurl"
                        class="avatar"
                        alt=""
                        v-if="scope.row.headimgurl"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="特权"
                prop="privilege"
            >
            </el-table-column>
            <el-table-column
                label="语言"
                prop="language"
            >
            </el-table-column>
            <el-table-column
                label="unionid"
                prop="unionid"
            >
            </el-table-column>
            <el-table-column
                label="openid"
                prop="openid"
            >
            </el-table-column>
            <el-table-column
                label="电话"
                prop="tel"
            >
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Headpanel from "../components/Headpanel.vue";
import { mapState } from "vuex";

export default {
    data() {
        return {
            resData: [],
            select:false,
            userid:"",
            typelist:{
                "all":'全部',
                "wechat":"微信",
                "tel":"手机"
            },
            value: "all",
            sexArr:{
                2:'女',
                1:'男'
            }
        };
    },
    methods: {
        list() {
            return this.get("list",{type:'user'})
                .then(res => {
                    this.resData = res;
                })
                .catch(e => {
                    this.$message({
                        type: "warning",
                        message: "获取列表失败!失败原因:" + e
                    });
                });
        }
    },
    created() {
        this.list();
    },
    computed: {
        tableData: function() {
            let arr = Array.from(this.resData);
            switch (true) {
                case (this.userid.length > 0) && this.select:
                    arr = arr.filter(val => (this.userid == val.id));
                    break;
                case this.value !== "all":
                    arr = arr.filter(val => ((this.value == "tel")?!val.openid:!!val.openid));
                    break;
                default:
                    break;
            }
            return arr;
        },
        ...mapState(["website"])
    },
    components: {
        "v-headpanel": Headpanel
    },
    filters: {

    }
};
</script>

<style lang="scss">
#article {
    img {
        max-width: 100%;
    }
    .articleContent {
        img {
            width: 100%;
        }
    }
    .el-input{
        width: 200px!important;
    }
    .avatar{
        width: 50px;
        height: 50px;
    }
    .lunbo{
        width: 16%;
        float: left;
        margin-right: 10px;
    }
    .el-form-item__content{
        width: 217px;
    }
    .m_content{
        width: 100%;
         .el-form-item__content{
            width: 70%;
        }
    }
}
</style>
