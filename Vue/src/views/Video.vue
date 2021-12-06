<template>
    <div id="banner">
        <v-headpanel>
            <em>视频列表</em>
            可以使用URL链接或者上传本地视频
        </v-headpanel>
        <el-row>
            <el-col
                :span="5"
                v-for="(o, index) in videos"
                :key="index"
                :offset="index%4 === 0 ? 0 : 1"
                :style="index%4 === 0 ? 'clear:both' : ''"
            >
                <el-card :body-style="{ padding: '0px' }">
                    <video
                        :src="o.path"
                        controls
                        class="image"
                    ></video>
                    <div class="buttonbar">
                        <span class="title">视频{{index+1}}</span>
                        <v-upload
                            @upload="updated"
                            @click.native="updateCur(o.id,index)"
                            :rules="{name:'video'+(index+1),mime:['video/mp4']}"
                            title="上传视频"
                        ></v-upload>
                        <el-button
                            type="danger"
                            size="small"
                            class="upload"
                            style="margin-right:10px"
                            @click="open(o.id,index)"
                        >
                            填写URL
                        </el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Headpanel from "../components/Headpanel.vue";
import Upload from "../components/Upload.vue";
import { mapState } from "vuex";

export default {
    data() {
        return {
            url: "video",
            videos: [],
            current:{
                index:0,
                id:1
            }
        };
    },
    methods: {
        open(id,index) {
            this.$prompt('请输入URL', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/,
            inputErrorMessage: 'URL格式不正确'
            }).then(({ value }) => {
                this.ajax('update', {type:'video',id,path:value})
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '填写URL成功'
                    });
                    this.videos.splice(index, 1, {id,path:value});
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "操作失败" + err
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        updateCur(id,index){
            this.current = {id,index};
        },
        updated: function({file,poster}) {
            this.ajax('update',{type:'video',id:this.current.id,path:file,poster})
            .then((res)=>{
                this.videos.splice(this.current.index, 1, res);
                this.$message({
                    type: "success",
                    message: "上传成功！"
                });
            })
            .catch((err)=>{
                this.$message({
                    type: "success",
                    message: "上传失败！"+err
                });
            })
        }
    },
    created() {
        return this.get("list",{type:'video'})
            .then(res => {
                this.videos = res;
            })
            .catch(e => {
                this.$message({
                    type: "warning",
                    message: "获取列表失败!失败原因:" + e
                });
            });
    },
    computed: {
        ...mapState(["website"])
    },
    components: {
        "v-headpanel": Headpanel,
        "v-upload": Upload
    }
};
</script>

<style lang='scss'>
#banner {
    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }
    .el-col {
        margin-bottom: 30px;
    }
    .buttonbar {
        padding: 14px;
        font-size: 18px;
        .title {
            line-height: 34px;
        }
        span {
            font-size: 18px;
            // line-height: 48px;
        }
        .upload {
            float: right;
            margin-bottom: 12px;
        }
    }
}
</style>
