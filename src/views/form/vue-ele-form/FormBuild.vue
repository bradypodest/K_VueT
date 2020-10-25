<!--
  采用组件 ： ele-form  （废弃）
  源码地址：https://github.com/dream2023/f-render
  动态表单界面
-->
<template>
  <ele-form v-model="formData" >
  </ele-form>
</template>

<script>
import { getOneByID, updateOne } from "@/api/form/form-design.js";
export default {
  props: {
    formDesignId: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      formData: {
        isShowSubmitBtn: false,
        isShowBackBtn: false,
        formDesc: {
          name: {
            type: "input",
            label: "姓名",
            break: false,
            layout: 24,
          },
        },
        order: ["name"],
      },

      formDesignData: "",
      jsonData: {}, //表单json配置数据
      // jsonData:{"list":[{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","customClass":"","disabled":false,"labelWidth":100,"isLabelWidth":false,"hidden":false,"dataBind":true,"showPassword":false,"remoteFunc":"func_1575897887618","remoteOption":"option_1575897887618"},"name":"单行文本","key":"1575897887618","model":"input_1575897887618","rules":[{"type":"string","message":"单行文本格式不正确"}]}],"config":{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}},
    };
  },

  methods: {
    //获取表单设计的设计数据
    getFormDesignData() {
      var that = this;
      getOneByID(that.formDesignId)
        .then((res) => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!",
            });

            that.formDesignData = res.data;
            console.log(that.formDesignData);
            debugger;
            if (that.formDesignData.JsonContent)
              that.jsonData = JSON.parse(that.formDesignData.JsonContent);
          }
        })
        .catch();
    },
  },
  mounted() {
    this.getFormDesignData();
  },
};
</script>