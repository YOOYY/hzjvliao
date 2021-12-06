
<template>
    <div class="upload">
        <slot>
            <el-button
                type="danger"
                size="small"
            >
                {{title}}
            </el-button>
        </slot>
        <input
            type="file"
            class="input-file"
            ref="inputFile"
            @change="upload($event)"
            :accept="rules['mime'] || '*/*'"
        >
        <span
            v-loading.fullscreen.lock="loading"
            element-loading-text="上传中,请稍候"
            element-loading-background="rgba(255, 255, 255, 0.3)"
        ></span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        };
    },
    props: {
        title:{
            type: String,
            default: "上传图片"
        },
        url: {
            type: String,
            default: "uploadfile"
        },
        rules: {
            type: Object,
            default: {}
        }
    },
    methods: {
        upload: function(e) {
            let file = e.target.files[0];
            if (file) {
                this.loading = true;
                let data = new FormData();
                if(this.rules.mime && (!this.rules.mime.includes(file.type))){
                    console.log(this.rules.mime);
                    console.log(file.type);
                    this.$message({
                        type: "error",
                        message: "文件格式错误"
                    });
                    this.clearFiles();
                    return;
                }
                if(this.rules.size && (file.size>this.rules.size)){
                    this.$message({
                        type: "error",
                        message: "文件过大"
                    });
                    this.clearFiles();
                    return;
                }
                data.append("file", file);
                data.append("file", JSON.stringify(this.rules));
                this.ajax(this.url, data)
                    .then(res => {
                        if (res) {
                            this.$emit("upload", res);
                            this.clearFiles();
                        } else {
                            Promise.reject("上传失败");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        if (err) {
                            this.$message({
                                type: "error",
                                message: err
                            });
                        } else {
                            this.$message({
                                type: "error",
                                message: "上传失败"
                            });
                        }
                        this.clearFiles();
                    });
            }
        },
        clearFiles() {
            this.$refs.inputFile.value = "";
            this.loading = false;
        }
    }
};
</script>

<style lang="scss" scope>
.upload {
    position: relative;
    cursor: pointer;
    button {
        cursor: pointer;
    }
}
.input-file {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
}
</style>