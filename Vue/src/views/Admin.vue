<template>
    <div id="Admin">
        <v-headpanel>
            <em>账户管理</em>
        </v-headpanel>
        <el-table
            :data="tableData"
            style="width: 100%"
        >
            <el-table-column
                label="ID"
                prop="id"
                width="100px"
            >
            </el-table-column>
            <el-table-column
                label="账户"
                prop="name"
            >
            </el-table-column>
            <el-table-column
                label="昵称"
                prop="nickname"
            >
            </el-table-column>
            <el-table-column align="right">
                <template slot="header">
                    操作
                </template>
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 创建账户 -->
        <el-dialog
            title="编辑账户信息"
            :visible.sync="panelShow"
            @opened="openPanel"
            :close-on-click-modal="false"
        >
            <el-form
                :model="form"
                ref="form"
                :inline="true"
                :rules="rules"
            >
                <el-form-item
                    label="账号"
                    label-width="100px"
                    prop="name"
                >
                    <el-input
                        v-model.trim="form.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    label-width="100px"
                    prop="password"
                >
                    <el-input v-model.trim="form.password"></el-input>
                </el-form-item>
                <el-form-item
                    label="昵称"
                    label-width="100px"
                    prop="nickname"
                >
                    <el-input v-model.trim="form.nickname"></el-input>
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

        <el-button
            @click="handleCreate"
            style="margin-top:20px"
            type="danger"
            size="small"
        >创建账户</el-button>
    </div>
</template>

<script>
import Headpanel from "../components/Headpanel.vue";
import { mapState } from "vuex";

export default {
    data() {
        return {
            tableData: [],
            panelShow: false,
            type: "create",
            form: {
                name: "",
                nickname: "",
                password: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 11,
                        message: "长度在 3 到 11 个字符",
                        trigger: "blur"
                    }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 3,
                        max: 11,
                        message: "长度在 3 到 11 个字符",
                        trigger: "blur"
                    }
                ],
                nickname: [
                    { required: true, message: "请输入昵称", trigger: "blur" }
                ]
            },
            table:'adminuser'
        };
    },
    methods: {
        handleEdit(index, row) {
            this.rules.password[0].required = false;
            this.form = JSON.parse(JSON.stringify(row));
            this.panelShow = true;
            this.type = "update";
            this.index = index;
        },
        handleCreate() {
            this.rules.password[0].required = true;
            this.form = {
                name: "",
                nickname: "",
                password: ""
            };
            this.panelShow = true;
            this.type = "create";
        },
        handleDelete(index, row) {
            if (index === 0) {
                this.$message({
                    type: "error",
                    message: "不可删除"
                });
                return;
            }
            this.deleteAjax("delete", { id: row.id,type:this.table }, this).then(res => {
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
        openPanel() {
            this.$refs["form"].clearValidate();
        },
        submit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    let url = "",
                        data = JSON.parse(JSON.stringify(this.form));
                        data.type = this.table;
                    if (this.type === "create") {
                        url = "create";
                    } else {
                        url = "update";
                        if (!data.password) {
                            delete data.password;
                        }
                    }
                    this.ajax(url, data)
                        .then(res => {
                            console.log(data);
                            if (this.type === "create") {
                                data.id = res.id;
                                this.tableData.push(data);
                            } else {
                                this.tableData.splice(this.index, 1, data);
                            }
                            this.panelShow = false;
                            this.$message({
                                type: "success",
                                message: "操作成功"
                            });
                        })
                        .catch(err => {
                            this.$message({
                                type: "error",
                                message: "操作失败" + err
                            });
                        });
                } else {
                    this.$message({
                        type: "warning",
                        message: "格式错误!"
                    });
                    return false;
                }
            });
        }
    },
    computed: {
        ...mapState(["website"])
    },
    created() {
        this.get("adminlist")
            .then(res => {
                this.tableData = res;
            })
            .catch(e => {
                this.$message({
                    type: "warning",
                    message: "获取列表失败!失败原因:" + e
                });
            });
    },
    components: {
        "v-headpanel": Headpanel
    }
};
</script>

<style lang='scss'>
</style>
