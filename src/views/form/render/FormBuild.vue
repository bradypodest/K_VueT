<!--
  采用组件 ： f-render  （废弃）
  源码地址：https://github.com/dream2023/f-render
  动态表单界面
-->
<template>
  <f-render v-model="formData" :config="jsonData" :loading="loading" pure />
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
      //jsonData: {}, //表单json配置数据
      jsonData: {
        isShowBackBtn: false,
        isShowSubmitBtn: false,
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
            //if (that.formDesignData.JsonContent)
              //that.jsonData = JSON.parse(that.formDesignData.JsonContent);
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