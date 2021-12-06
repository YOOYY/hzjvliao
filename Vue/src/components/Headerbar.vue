<template>
    <el-header>
        {{title}}
    </el-header>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            title: "账户管理"
        };
    },
    watch: {
        "$route.name": function(newVal, oldVal) {
            this.sideMenu.forEach(val => {
                if (val.url === newVal) {
                    this.title = val.title;
                }
            });
        }
    },
    computed: {
        ...mapState(["sideMenu"])
    }
};
</script>

<style lang='scss'>
.el-header {
    padding: 0;
    background-color: #2cbda0;
    height: 50px !important;
    line-height: 50px;
    color: #fff;
    font-size: 18px;
    padding-left: 20px;
}
</style>
