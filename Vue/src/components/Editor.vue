<!-- 组件代码如下 -->
<template>
  <div>
    <!-- quill-editor插件标签 分别绑定各个事件-->
    <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>
    
    <!-- 文件上传input 将它隐藏-->
    <el-upload class="upload-demo" :action="qnLocation" :before-upload='qnUpload' :data="uploadData"
      ref="upload" style="display:none">
      <el-button size="small" type="primary" id="imgInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
// import Vue from 'util/vueExt'
// import { Component } from 'vue-property-decorator'
// import * as Template from './editor.vue'
import * as Quill from 'quill'    // 引入编辑器

const STATICDOMAIN = '//ss.yidejia.com/'
const STATVIDEO = '//flv.yidejia.com/'

export default {
    name: 'Editor',
    data(){
        return{
          content = '',    // 文章内容
          editorOption = {},   // 编辑器选项
          addRange: any = new Array(),
          uploadData = {},
          photoUrl = '',         // 上传图片地址
          uploadType = '',    // 上传的文件类型（图片、视频）
          fullscreenLoading = false
        }
    },
    props: ["myQuillEditor", "imgInput"],
    methods: {
      qnLocation() {
        if (location.protocol === 'http:') {
          return 'http://up-z0.qiniu.com'
        }
        return 'https://up-z0.qbox.me'
      },
      qnUpload(file) {
        this.fullscreenLoading = true;
        const suffix = file.name.split('.')
        const ext = suffix.splice(suffix.length - 1, 1)[0]
        console.log(this.uploadType)
        if (this.uploadType === 'image') {  // 如果是点击插入图片
          return this.api.getQNToken().then(res => {
            this.uploadData = {
              key: `image/${suffix.join('.')}_${new Date().getTime()}.${ext}`,
              token: res
            }
          })
        } else if (this.uploadType === 'video') {  // 如果是点击插入视频
          return this.api.getVideoQNToken().then(res => {
            this.uploadData = {
              key: `video/${suffix.join('.')}_${new Date().getTime()}.${ext}`,
              token: res
            }
          })
        }
      },
      // beforeUpload(file) {
      //   return this.qnUpload(file)
      // },
      upScuccess(e, file, fileList) {
        this.fullscreenLoading = false
        let vm = this
        let url = ''
        if (this.uploadType === 'image') {    // 获得文件上传后的URL地址
          url = STATICDOMAIN + e.key
        } else if (this.uploadType === 'video') {
          url = STATVIDEO + e.key
        }
        if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
          let value = url
          vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
          value = value.indexOf('http') !== -1 ? value : 'http:' + value
          vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
        } else {
          this.$message.error(`${vm.uploadType}插入失败`)
        }
        this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
      },
      // 点击图片ICON触发事件
      imgHandler(state) {
        this.addRange = this.$refs.myQuillEditor.quill.getSelection()
        if (state) {
          let fileInput = document.getElementById('imgInput')
          fileInput.click() // 加一个触发事件
        }
        this.uploadType = 'image'
      },

      // 点击视频ICON触发事件
      videoHandler(state) {
        this.addRange = this.$refs.myQuillEditor.quill.getSelection()
        if (state) {
          let fileInput = document.getElementById('imgInput')
          fileInput.click() // 加一个触发事件
        }
        this.uploadType = 'video'
      },

      // 编辑器光标离开 将编辑器内容发射给父组件
      onEditorBlur(editor) {
        this.$emit('getValue', this.content)
      },

      // 编辑器文本发生变化
      onEditorChange({ editor, html, text }) {
        // let textLength = text.length
        // if (textLength > 10000) {
        //   (<any>this).$message.error('最多输入10000个字符')
        //   editor.enable(false)
        // }
        // this.$emit('getValue', this.content)
      },

      // 清除编辑器内容
      callMethod() {
        this.content = ''
      },
    },
    mounted() {
      // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
      this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
    }
}
</script>
<style lang="scss">
.quill-editor {
  height: 745px;

  .ql-container {
    height: 680px;
  }
}

.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;

  span {
    color: #ee2a7b;
  }
}

.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}
</style>