<template>
  <div id="privilege">
    <v-headpanel> <em>区域名称</em>修改区域名称。 </v-headpanel>
    <el-button
      size="mini"
      type="danger"
      @click="openPanel('create')"
      class="marginBottom15"
      >新增区域</el-button
    >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button size="mini" @click="updateHandle(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑区域" :visible.sync="panelShow">
      <el-form :model="form">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="gametype"
          label-width="120px"
          v-show="type !== 'update'"
        >
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closePanel()">取 消</el-button>
        <el-button type="primary" @click="submit(type)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import Headpanel from "../components/Headpanel.vue";
export default {
  data() {
    return {
        table:'maplist',
        panelShow: false,
        tableData: [],
        type: "update",
        index: "",
        form: {
            name: "",
            id: "",
            type:"maplist"
        },
    };
  },
  methods: {
    updateHandle(index, row) {
      this.form.name = row.name;
      this.form.id = row.id;
      this.index = index;
      this.openPanel("update");
    },
    handleDelete(index, row) {
      this.deleteAjax('delete', { id: row.id,type:this.table }, this)
        .then((res) => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch((e) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    openPanel(type) {
      this.type = type;
      if (type === "create") {
        this.form.name = "";
        this.form.id = "";
      }
      this.panelShow = true;
    },
    submit(type) {
        this.ajax(type, this.form)
        .then((res) => {
            if(type == 'create'){
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
    closePanel() {
      this.panelShow = false;
    },
    ...mapMutations(["updateState"]),
  },
  computed: {
    ...mapState(["admin", "sideMenu"]),
  },
  mounted() {
    this.get("list",{type:this.table}).then((res) => {
      this.tableData = res;
    });
  },
  components: {
    "v-headpanel": Headpanel,
  },
};
</script>
<style lang='scss'>
#privilege {
  .el-dialog h2 {
    margin-top: 0;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-tag {
    cursor: pointer;
    margin: 5px 5px;
  }

  .on {
    background-color: rgba(245, 108, 108, 0.1);
    border-color: rgba(245, 108, 108, 0.2);
    color: #f56c6c;
  }
  .updateNameLabel {
    line-height: 40px;
    text-align: center;
    font-size: 16px;
  }
  .marginBottom15 {
    margin-bottom: 15px;
  }
}
</style>