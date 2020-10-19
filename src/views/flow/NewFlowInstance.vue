<template>
  <div class="new_flow_instance">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="{ span: 20, offset: 2 }"
        :md="{ span: 20, offset: 2 }"
        :lg="{ span: 14, offset: 5 }"
        :xl="{ span: 12, offset: 6 }"
      >
        <el-steps :space="200" :active="active" align-center class="steps">
          <el-step title="填写流程基本信息"></el-step>
          <el-step title="选择流程模板"></el-step>
        </el-steps>

        <!-- 选择模板  Start -->
        <el-form
          ref="selFlowTemForm"
          :model="selFlowTemFormData"
          :rules="selFlowTemRules"
          size="medium"
          label-width="120px"
          v-if="active == 1"
        >
        </el-form>

        <!-- 选择模板  End  -->
        <!--  填写流程基本信息 表单 Start -->
        <el-form
          ref="basicForm"
          :model="basicFormData"
          :rules="basicRules"
          size="medium"
          label-width="120px"
          v-if="active == 2"
        >
          <el-form-item label="实例编号" prop="Code">
            <el-input
              v-model="basicFormData.Code"
              placeholder="请输入实例编号"
              :disabled="true"
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="标题" prop="Name">
            <el-input
              v-model="basicFormData.Name"
              placeholder="请输入标题"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="FlowLevel">
            <el-rate v-model="basicFormData.FlowLevel" :max="5"></el-rate>
          </el-form-item>
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
        </el-form>
        <!-- 填写流程基本信息 表单 end -->

        <div class="step_button">
          <el-button type="primary" @click="Next" v-if="active == 1"
            >下一步</el-button
          >
          <el-button type="primary" @click="PreStep" v-if="active == 2"
            >上一步</el-button
          >
          <el-button type="primary" @click="Submit" v-if="active == 2"
            >提交</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "NewFlowInstance",
  components: {},
  props: {},
  data() {
    return {
      active: 1,
      basicFormData: {
        Code: undefined,
        Name: undefined,
        FlowLevel: 0,
        Remark: undefined,
      },
      basicRules: {
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
    Next() {
      //判断是否已经选择了 流程模板

      this.active += 1;
    },
    PreStep() {
      this.active -= 1;
    },
    Submit() {
      //判断所有数据是否输入

      this.$message.success("提交成功");
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.new_flow_instance {
  margin-top: 35px;

  .steps {
    justify-content: center;
    margin-bottom: 20px;
  }
  .step_button {
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>