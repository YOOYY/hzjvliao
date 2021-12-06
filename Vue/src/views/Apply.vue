<template>
    <div id="article">
        <v-headpanel>
            <em>审核信息列表</em>
        </v-headpanel>

        <el-button
            @click="handleCreate"
            style="margin:20px 0"
            type="danger"
            size="small"
        >创建申请信息</el-button>
        <el-select
            v-model="value"
            placeholder="选择区域"
            style="margin-left:20px"
        >
            <el-option
                v-for="(name,id) in select"
                :key="id"
                :label="name"
                :value="id"
            >
            </el-option>
        </el-select>

        <el-select
            v-model="state"
            placeholder="选择状态"
            style="margin-left:20px"
        >
            <el-option
                v-for="(name,id) in stateList"
                :key="id"
                :label="name"
                :value="id"
            >
            </el-option>
        </el-select>

        <el-table
            :data="tableData"
            style="width: 100%"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-tag type="info" style="margin:10px 0">内容</el-tag>
                    <div
                        v-html="props.row.content"
                        class="articleContent"
                    ></div>
                    <el-tag type="info" style="margin:10px 0">图片</el-tag>
                    <div style="overflow:hidden">
                        <img :src="item" alt="" v-for="item in (props.row.photos?props.row.photos.split(','):[])" :key="item" class="lunbo">
                    </div>
                    <el-tag type="info" style="margin:10px 0">视频</el-tag>
                    <div>
                        <video :src="props.row.video" controls style="width:300px"></video>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="ID"
                prop="id"
            >
            </el-table-column>
            <el-table-column
                label="姓名"
                prop="name"
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
                <template slot-scope="scope">
                    {{maplist[scope.row.province]}}
                </template>
            </el-table-column>
            <el-table-column
                label="病情"
                prop="degree"
            >
                <template slot-scope="scope">
                    {{degreeArr[scope.row.degree]}}
                </template>
            </el-table-column>
            <el-table-column
                label="电话"
                prop="tel"
            >
            </el-table-column>
            <el-table-column
                label="头像"
                prop="avatar"
            >
                <template slot-scope="scope">
                    <img
                        :src="scope.row.avatar"
                        class="avatar"
                        alt=""
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="权重"
                prop="weight"
                sortable
                :sort-method="sort"
            >
            </el-table-column>
            <el-table-column
                label="申请时间"
                prop="time"
            >
                <template slot-scope="scope">
                    {{scope.row.time|getLocalTime}}
                </template>
            </el-table-column>
            <el-table-column
                label="用户id"
                prop="userid"
            >
            </el-table-column>
            <el-table-column align="right" width="300px">
                <template slot-scope="scope">
                    <el-tag type="success" v-show="scope.row.state == 1">已同意</el-tag>
                    <el-tag type="info" v-show="scope.row.state == 0">已拒绝</el-tag>
                    <el-tag type="warning" v-show="scope.row.state == 2">申请中</el-tag>
                    <el-button
                        size="mini"
                        type="success"
                        style="margin-left:10px"
                        v-show="scope.row.state == 2"
                        @click="apply(scope.$index, scope.row,1)"
                    >同意</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        v-show="scope.row.state == 2"
                        @click="apply(scope.$index, scope.row,0)"
                    >拒绝</el-button>
                    <el-button
                        size="mini"
                        v-show="scope.row.state != 2"
                        @click="updateHandle(scope.$index, scope.row)"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        v-show="scope.row.state != 2"
                        @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="编辑审核信息"
            :visible.sync="panelShow"
            :close-on-click-modal="false"
        >
            <el-form
                :model="form"
                ref="form"
                :inline="true"
                :rules="rules"
            >
                <el-form-item
                    label="姓名"
                    label-width="100px"
                    prop="name"
                >
                    <el-input v-model.trim="form.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="性别"
                    label-width="100px"
                    prop="sex"
                >
                    <el-select
                        v-model.trim="form.sex"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="(sex,id) in sexArr"
                            :key="id"
                            :label="sex"
                            :value="id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="省份"
                    label-width="100px"
                    prop="province"
                >
                    <el-select
                        v-model.trim="form.province"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="(province,id) in maplist"
                            :key="id"
                            :label="province"
                            :value="id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="病情"
                    label-width="100px"
                    prop="degree"
                >
                    <el-select
                        v-model.trim="form.degree"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="(degree,id) in degreeArr"
                            :key="id"
                            :label="degree"
                            :value="id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="电话"
                    label-width="100px"
                    prop="tel"
                >
                    <el-input v-model.number="form.tel"></el-input>
                </el-form-item>
                <el-form-item
                    label="权重"
                    label-width="100px"
                    prop="weight"
                >
                    <el-input v-model.number="form.weight"></el-input>
                </el-form-item>
                <el-form-item
                    label="申请时间"
                    label-width="100px"
                    prop="time"
                >
                    <el-date-picker
                    v-model="form.time"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="头像"
                    label-width="100px"
                    prop="avatar"
                >
                    <img :src="form.avatar" style="width:50px;margin-right:10px;vertical-align: middle;" v-if="form.avatar">
                    <v-upload
                        style="display:inline-block;"
                        :rules="{size:2*1024*1024,mime:['image/jpeg','image/png']}"
                        @upload="updated($event,'avatar')"
                    >
                        <el-button type="danger">上传头像</el-button>
                    </v-upload>

                </el-form-item>
                <el-form-item
                    label="内容"
                    label-width="100px"
                    prop="content"
                    class="m_content"
                >
                <el-input type="textarea" v-model="form.content" :rows="6"></el-input>
                </el-form-item>
                
                <el-form-item
                    label="图片"
                    label-width="100px"
                    prop="photos"
                    class="m_content"
                >
                    <img :src="item" alt="" v-for="(item,index) in (form.photos?form.photos.split(','):[])" :key="item" style="width:80px;margin-right:10px;vertical-align: middle;" @click="delPhoto(index,form.photos)">
                    <v-upload
                        style="display:inline-block;"
                        :rules="{size:2*1024*1024,mime:['image/jpeg','image/png']}"
                        @upload="addPhoto"
                    >
                        <el-button type="danger">上传图片</el-button>
                    </v-upload>
                </el-form-item>

                <el-form-item
                    label="视频"
                    label-width="100px"
                    prop="video"
                    class="m_content"
                >
                    <video :src="form.video" style="width:400px;margin-right:10px;vertical-align: middle;" v-if="form.video" controls></video>
                    <v-upload
                        style="display:inline-block;"
                        @upload="updated($event,'video')"
                        :rules="{mime:['video/mp4']}"
                    >
                        <el-button type="danger">上传视频</el-button>
                    </v-upload>
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="closePanel">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submit"
                >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Headpanel from "../components/Headpanel.vue";
import Upload from "../components/Upload.vue";
import { mapState } from "vuex";

export default {
    data() {
        return {
            resData: [],
            type: "create",
            panelShow: false,
            index: "",

            form: {
                name: "",
                sex: 2,
                province: "",
                degree: 0,
                tel: "",
                photos: "",
                avatar: "",
                video:"",
                content:"",
                weight:0,
                time:"",
                state:2
            },

            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ]
            },

            maplist:{},
            value: "all",
            sexArr:{
                0:'女',
                1:'男',
                2:'未知'
            },
            degreeArr:{
                0:'轻微',
                1:'中等',
                2:'严重'
            },
            stateArr:{
                0:'已拒绝',
                1:'已同意',
                2:'申请中'
            },
            state:'2'
        };
    },
    methods: {
        updateHandle(index, row) {
            this.form = {...row};
            this.panelShow = true;
            this.type = "update";
            this.index = index;
        },
        handleCreate() {
            this.form = {
                name: "",
                sex: "2",
                poster:'',
                province: "",
                degree: "0",
                tel: "",
                photos: "",
                avatar: "",
                video:"",
                content:"",
                weight:0,
                time:"",
                state:1
            };
            this.panelShow = true;
            this.type = "create";
        },
        handleDelete(index, row) {
            this.deleteAjax("delete", { type:'apply',id: row.id }, this).then(res => {
                this.tableData.splice(index, 1);
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
            });
        },
        closePanel() {
            this.panelShow = false;
        },
        delPhoto(index,photos){
            let arr = photos.split(',');
            arr.splice(index,1);
            this.form.photos = arr.join(',');
        },
        addPhoto(url){
            this.form.photos = this.form.photos?(this.form.photos+','+url):url;
        },
        updated(file,prop) {
            console.log(file);
            if(typeof file == 'object'){
                this.form['poster'] = file.poster;
                this.form[prop] = file.file;
            }else{
                this.form[prop] = file;
            }
        },
        submit() {
            this.ajax(this.type, {type:'apply',...this.form})
            .then((res) => {
                if(this.type == 'create'){
                    this.tableData.push(res);
                }else{
                    this.tableData.splice(this.index, 1, res);
                }
                this.$message({
                    type: "success",
                    message: "添加成功!",
                });
            })
            .catch((e) => {
                this.$message({
                type: "error",
                message: e,
                });
            });
            this.closePanel();
        },
        apply(index, row,state){
            let {id} = row;
            this.ajax('update', {type:'apply',id,state})
                .then(res => {
                    this.list().then(res => {
                        this.closePanel();
                        this.$message({
                            type: "success",
                            message: "操作成功"
                        });
                    });
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "操作失败" + err
                    });
                });
        },
        list() {
            return this.get("list",{type:'apply'})
                .then(res => {
                    this.resData = res;
                })
                .catch(e => {
                    this.$message({
                        type: "warning",
                        message: "获取列表失败!失败原因:" + e
                    });
                });
        },
        getMap(){
            return this.get("map",{type:'maplist'})
                .then(res => {
                    this.maplist = res;
                })
                .catch(e => {
                    this.$message({
                        type: "warning",
                        message: "获取地区列表失败!失败原因:" + e
                    });
                });
        },
        sort(a, b) {
            let res = +a.weight - +b.weight;
            return res;
        },
    },
    created() {
        this.list();
        this.getMap();
    },
    computed: {
        tableData: function() {
            let arr = Array.from(this.resData);
            switch (true) {
                case this.value !== "all":
                    arr = arr.filter(val => (val.province === this.value));
                case this.state !== "all":
                    arr = arr.filter(val => (val.state == this.state));
                default:
                    break;
            }
            return arr;
        },
        stateList: function(){
            return {all:"全部",...this.stateArr};
        },
        select:function(){
            return {all:"全部地区",...this.maplist};
        },
        ...mapState(["website"])
    },
    components: {
        "v-headpanel": Headpanel,
        "v-upload": Upload
    },
    filters: {
        getLocalTime(time) {
            let res = time?new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,''):'';
            return res;  
        }
    }
};
</script>

<style lang="scss">
#article {
    .upload1 {
        height: 0;
        width: 0;
        opacity: 0;
        overflow: hidden;
    }
    img {
        max-width: 100%;
    }
    .articleContent {
        img {
            width: 100%;
        }
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
