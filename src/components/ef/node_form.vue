<template>
  <div>
    <div class="ef-node-form">
      <div class="ef-node-form-header">编辑</div>
      <div class="ef-node-form-body">
        <el-form
          :model="node"
          ref="dataForm"
          label-width="80px"
          v-show="type === 'node'"
        >
          <el-form-item label="ID">
            <el-input v-model="node.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="node.type" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="node.name"></el-input>
          </el-form-item>
          <el-form-item label="left坐标">
            <el-input v-model="node.left" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="top坐标">
            <el-input v-model="node.top" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="ico图标">
            <el-input v-model="node.ico"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="node.state" placeholder="请选择">
              <el-option
                v-for="item in stateList"
                :key="item.state"
                :label="item.label"
                :value="item.state"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 节点 扩展属性  Start-->
          <el-form-item label="第三方回调URL">
            <el-input v-model="node.callbackURL"></el-input>
          </el-form-item>
          <el-form-item label="执行权限">
            <el-input v-model="node.goPower"></el-input>
          </el-form-item>
          <el-form-item v-if="node.goPower == '1'" label="指定角色">
            <el-input v-model="node.role"></el-input>
          </el-form-item>
          <el-form-item v-if="node.goPower == '2'" label="指定用户">
            <el-input v-model="node.user"></el-input>
          </el-form-item>
          <el-form-item v-if="node.type == 'jointlyStart'" label="会签类型">
            <el-input v-model="node.countersign"></el-input>
          </el-form-item>

          <!-- 节点 扩展属性  End -->

          <el-form-item>
            <el-button icon="el-icon-close">重置</el-button>
            <el-button type="primary" icon="el-icon-check" @click="save"
              >保存</el-button
            >
          </el-form-item>
        </el-form>

        <el-form
          :model="line"
          ref="dataForm"
          label-width="80px"
          v-show="type === 'line'"
        >
          <el-form-item label="条件">
            <el-input v-model="line.label"></el-input>
          </el-form-item>

          <!-- 线 扩展属性  Start-->
          <el-form-item label="表单字段条件">
            <el-input v-model="line.conditions"></el-input>
          </el-form-item>

          <!--线  扩展属性  End -->

          <el-form-item>
            <el-button icon="el-icon-close">重置</el-button>
            <el-button type="primary" icon="el-icon-check" @click="saveLine"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--            <div class="el-node-form-tag"></div>-->
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";

export default {
  data() {
    return {
      visible: true,
      // node 或 line
      type: "node",
      node: {},
      line: {},
      data: {},
      stateList: [
        {
          state: "success",
          label: "成功",
        },
        {
          state: "warning",
          label: "警告",
        },
        {
          state: "error",
          label: "错误",
        },
        {
          state: "running",
          label: "运行中",
        },
      ],
    };
  },
  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    nodeInit(data, id) {
      this.type = "node";
      this.data = data;
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = cloneDeep(node);
        }
      });
    },
    lineInit(data, jsPline) {
      this.type = "line";
      this.data = data;
      //this.line = jsPline;
debugger;
      data.lineList.filter((item)=>{
        if (
          item.from === jsPline.from &&
          item.to === jsPline.to
        ) {
          debugger
          this.line = cloneDeep(item);
        }
      });

    },
    // 修改连线
    saveLine() {
      this.data.lineList.filter((item) => {
        debugger;
        if (item.from === this.line.from && item.to === this.line.to) {
          //item.from = this.line.from;
          //item.to = this.line.to;
          item.label = this.line.label;

          //扩展 Start
          item.conditions = this.line.conditions;
          //扩展 end

          //this.$emit("repaintEverything");
        }
      });

      this.$emit(
        "setLineLabel",
        this.line.from,
        this.line.to,
        this.line.label,
        this.line
      );
    },
    save() {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.name = this.node.name;
          node.left = this.node.left;
          node.top = this.node.top;
          node.ico = this.node.ico;
          node.state = this.node.state;

          //扩展 Start
          node.callbackURL = this.node.callbackURL;
          node.goPower = this.node.goPower;
          node.role = this.node.role;
          node.user = this.node.user;
          node.countersign = this.node.countersign;
          //扩展 end

          this.$emit("repaintEverything");
        }
      });
    },
  },
};
</script>

<style>
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}
</style>
