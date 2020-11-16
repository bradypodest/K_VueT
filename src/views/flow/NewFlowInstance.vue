<template>
  <div class="new_flow_instance">
    <el-form
      ref="basicForm"
      :model="basicFormData"
      :rules="basicRules"
      size="medium"
      label-width="120px"
    >
      <el-row type="flex" :gutter="20" align="middle" justify="center">
        <el-col :span="3">
          <span class="form_title">发起流程</span>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" align="middle" >
        <el-col :span="12">
          <el-form-item label="标题" prop="Name">
            <el-input
              v-model="basicFormData.Name"
              placeholder="请输入标题"
              clearable
              :disabled="true"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="等级" prop="FlowLevel">
            <el-rate v-model="basicFormData.FlowLevel" :max="5"></el-rate>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" align="middle" >
        <el-col :span="12">
          <el-form-item label="流程模板" prop="SchemeId">
            <el-select
              v-model="basicFormData.SchemeId"
              placeholder="请先选择流程模板"
              :style="{ width: '100%' }"
              @change="GetFlowSchemeData"
            >
              <el-option
                v-for="(scheme, index) in GetOneDic('FlowScheme')"
                :key="index"
                :label="scheme.value"
                :value="scheme.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="Remark">
            <el-input
              v-model="basicFormData.Remark"
              type="textarea"
              placeholder="请输入描述"
              :maxlength="4000"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" :gutter="20" align="middle" >
        <el-col :span="12">
          <el-form-item label="描述" prop="Remark">
            <el-input
              v-model="basicFormData.Remark"
              type="textarea"
              placeholder="请输入描述"
              :maxlength="4000"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row type="flex" :gutter="20" align="middle" >
        <!-- 表单 start -->
        <el-col :span="24">
          <div class="form_design">
            <el-form-item label="表单" hidden>
              <el-input
                v-model="basicFormData.FormDesignId"
                disabled
                hidden
              ></el-input>
            </el-form-item>

            <FormBuild
              :formDesignId="basicFormData.FormDesignId"
              ref="formBuild"
              v-if="basicFormData.FormDesignId"
            >
            </FormBuild>
          </div>
        </el-col>
      </el-row>
      <!-- 表单 end -->
      <!-- 流程设计 start -->

      <el-row type="flex" :gutter="20" align="middle" >
        <el-col :span="24">
          <div class="flow_design">
            <FlowDesign
              :flowSchemeDataP="flowSchemeData"
              ref="flowDesign"
              v-if="flowSchemeData"
            >
            </FlowDesign>
          </div>
        </el-col>
        <!-- 流程设计 end -->
      </el-row>
      <el-row type="flex" :gutter="20" align="middle"> 
        <el-col :span="6">
        <el-button type="primary" @click="Submit" 
      >提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { GetDictionary } from "@/api/system/sys-dictionary";
import { getOneByID as getOneFlowScheme } from "@/api/flow/flow-scheme";
import { getOneByID as getOneFormDesign } from "@/api/form/form-design";

import dateUtil from "@/utils/date";

import FormBuild from "@/views/form/ele/FormBuild.vue";
import FlowDesign from "@/views/flow/FlowDesign.vue";

export default {
  name: "NewFlowInstance",
  components: { FormBuild, FlowDesign },
  props: {},
  data() {
    return {
      active: 1,
      dicKeys: ["FlowScheme"],
      dictionaryData: {},
      flowSchemeData: null,
      formDesignData: null,

      basicFormData: {
        // Code: undefined,
        Name: undefined,
        FlowLevel: 0,
        Remark: undefined,
        FormDesignId: null,
        SchemeId: null,
      },
      basicRules: {
        SchemeId: [
          {
            required: true,
            message: "请先选择流程模板",
            trigger: "blur",
          },
        ],
        Code: [
          {
            required: true,
            message: "请输入实例编号",
            trigger: "blur",
          },
        ],
        Name: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        FlowLevel: [],
        Remark: [],
      },
    };
  },
  methods: {
    Submit() {
      var that = this;
      //判断所有数据是否输入
      if (!that.basicFormData.SchemeId) {
        this.$message.error("请先选择流程模板！");
        return false;
      } else if (!that.basicFormData.FormDesignId) {
        this.$message.error("选择的流程模板没有对应的表单,请先去配置！");
        return false;
      } else if (!that.flowSchemeData) {
        this.$message.error("选择的流程模板没有对应流程图，请先去配置！");
        return false;
      }
debugger;
      //判断 表单的数据 是否已经输入
      this.$refs.formBuild.getFormData().then(data => {
        debugger
        

        console.log(that.basicFormData);
        
        this.$message.success("提交成功");

      }).catch(e => {
        this.$message.error(e);
      })
    },

    //获取字典数据
    GetDictionaryInfo() {
      var that = this;
      //var dicKeys = ["FlowScheme"];
      GetDictionary(that.dicKeys)
        .then((res) => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!",
            });

            that.dictionaryData = res.data;
            console.log("字典数据");
            console.log(res.data);
          }
        })
        .catch();
    },
    //获取字典中 其中的一个
    GetOneDic(dickey) {
      var that = this;

      if (that.dictionaryData && that.dictionaryData.length > 0) {
        var dicOne = that.dictionaryData.filter((x) => {
          return x.dicNo == dickey;
        });
        return dicOne[0].data;
      } else {
        return [];
      }
    },
    //获取流程设计配置信息
    GetFlowSchemeData(value) {
      var that = this;

      if (value) {
        getOneFlowScheme(value)
          .then((res) => {
            that.$message({
              type: "success",
              message: "获取成功!",
            });
            debugger;
            that.flowSchemeData = res.data;
            console.log(that.flowSchemeData);

            if (that.flowSchemeData && that.flowSchemeData.FormDesignId) {
              that.basicFormData.FormDesignId =
                that.flowSchemeData.FormDesignId;
              //that.$refs.flowDesign.dataReload(that.flowSchemeData);
              //that.$refs.formBuild.reload(that.formDesignId);
            }

            //设置流程实例 名称
            that.basicFormData.Name =
              "[" +
              this.$store.getters.name +
              "][" +
              dateUtil.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss") +
              "]" +
              that.flowSchemeData.SchemeName;
            that.basicFormData.FlowLevel = 0;
          })
          .catch();
      }
    },
  },
  created() {},
  mounted() {
    //初始化获取一些字典数据
    this.GetDictionaryInfo();

    //生成流程实例编号
  },
};
</script>

<style lang="scss" scoped>
.new_flow_instance {
  margin-top: 35px;
  width: 70%;
  margin: 0 auto;
  .form_title{
    font-size: 30px;
  }
  .flow_info {
  }
  .steps {
    justify-content: center;
    margin-bottom: 20px;
  }
  .form_design {
    min-height: 250px;
    overflow-y: auto;
    max-height: 300px;
    border: 1px dashed;
    margin-bottom: 20px;
  }
  .flow_design {
    height: 420px;
    overflow-y: auto;
    border: 1px dashed;
    margin-bottom: 20px;
  }
  .step_button {
    text-align: center;
  }
}
</style>