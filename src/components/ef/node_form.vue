<!--
  属性面板
-->
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
            <el-input v-model="node.thirdPartyUrl"></el-input>
          </el-form-item>
          <el-form-item label="执行权限">
            <el-input v-model="node.nodePowerType"></el-input>
          </el-form-item>
          <el-form-item v-if="node.nodePowerType == '1'" label="指定角色">
            <!-- <el-input v-model="node.nodePowerData.roles[0]"></el-input> -->
            <el-checkbox-group v-model="node.nodePowerData.roles">
              <el-checkbox label="admin"></el-checkbox>
              <el-checkbox label="user"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="node.nodePowerType == '2'" label="指定用户">
            <!-- <el-input v-model="node.nodePowerData.users[0]"></el-input> -->
            <!-- 暂时这样用 -->
            <el-checkbox-group v-model="node.nodePowerData.users">
              <el-checkbox label="admin"></el-checkbox>
              <el-checkbox label="user"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="node.type == 'jointlyStart'" label="会签类型">
            <el-input v-model="node.nodeCountersignType"></el-input>
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
          <el-form-item label="id">
            <el-input v-model="line.id" disabled></el-input>
          </el-form-item>

          <el-form-item label="名称">
            <el-input v-model="line.label"></el-input>
          </el-form-item>

          <!-- 线 扩展属性  Start-->
          <el-form-item label="字段条件">
            <!-- <el-input v-model="line.conditions"></el-input> -->
            <!-- <SelectCondition :v-for="(item,index) in line.conditions" :key="index" :compare="item">
            </SelectCondition> -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              @click="AddConditions"
            ></el-button>
            <div v-if="line.conditions && line.conditions.length > 0">
              <div v-for="(condition, index) in line.conditions" :key="index">
                <el-row>
                  <el-col :span="8">
                    <el-select
                      v-model="condition.fieldName"
                      placeholder="请选择字段"
                      v-if="fieldNames && fieldNames.length>0"
                    >
                      <el-option
                        v-for="item in fieldNames"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <el-input v-model="condition.fieldName" placeholder="请输入字段" v-else>
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      v-model="condition.operation"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-input
                      v-model="condition.value"
                      placeholder="请输入"
                    ></el-input>
                  </el-col>
                  <el-col :span="4">
                    <!-- <el-button type="primary" icon="el-icon-plus" circle @click="Add" v-if="index==0"></el-button> -->
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="Del(index)"
                    ></el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
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
  props:{
    fieldNames:{
      type:Array,
      default:function(){
				return [];
			}
    }
  },
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

      //字段
      fieldNameOptions: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      //条件选择 ，如 >, <
      options: [
        {
          value: ">",
          label: ">",
        },
        {
          value: ">=",
          label: ">=",
        },
        {
          value: "<",
          label: "<",
        },
        {
          value: "<=",
          label: "<=",
        },
        {
          value: "=",
          label: "=",
        },
        {
          value: "!=",
          label: "!=",
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
      data.lineList.filter((item) => {
        if (item.from === jsPline.from && item.to === jsPline.to) {
          this.line = cloneDeep(item);
        }
      });
    },
    // 修改连线
    saveLine() {
      this.data.lineList.filter((item) => {
        if (item.from === this.line.from && item.to === this.line.to) {
          //item.from = this.line.from;
          //item.to = this.line.to;
          item.label = this.line.label;

          //扩展 Start
          item.id = this.line.id;
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
          node.thirdPartyUrl = this.node.thirdPartyUrl;
          node.nodePowerType = this.node.nodePowerType;
          node.nodePowerData.roles = this.node.nodePowerData.roles;
          node.nodePowerData.users = this.node.nodePowerData.users;
          node.nodeCountersignType = this.node.nodeCountersignType;
          //扩展 end

          this.$emit("repaintEverything");
        }
      });
    },

    AddConditions() {
      this.line.conditions.push({
        fieldName: "",
        operation: "",
        value: "",
      });
    },
    //删除第几个字段条件
    Del(index){
      this.line.conditions.splice(index,1);
    }
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
