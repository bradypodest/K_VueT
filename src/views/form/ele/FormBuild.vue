<!--
  采用组件 ： vue-form-making 
  源码地址：https://github.com/GavinZhuLei/vue-form-making
  设计表单界面-可拖拽生成表单
-->
<template>
  <div>
    <fm-generate-form :data="jsonData" ref="generateForm" 
    :value="editData"
    v-if="formDesignId&&jsonData"> </fm-generate-form>
    <!-- <el-button type="primary" @click="handleSubmit">Submit</el-button> -->
  </div>
</template>

<script>
import { getOneByID, updateOne } from "@/api/form/form-design.js";
export default {
  props: {
    formDesignId: {
      type: String,
      default:null
    },
    editData:{
      type:Object,
      default:()=>{}
    }
  },
  data() {
    return {
      formDesignData: "",
      jsonData: "", //表单json配置数据
      // jsonData:{"list":[{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","customClass":"","disabled":false,"labelWidth":100,"isLabelWidth":false,"hidden":false,"dataBind":true,"showPassword":false,"remoteFunc":"func_1575897887618","remoteOption":"option_1575897887618"},"name":"单行文本","key":"1575897887618","model":"input_1575897887618","rules":[{"type":"string","message":"单行文本格式不正确"}]}],"config":{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}},
    };
  },

  methods: {
    //获取表单设计的设计数据
    getFormDesignData() {
      var that = this;
      debugger
      if (that.formDesignId) {
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
              {
                that.jsonData = JSON.parse(that.formDesignData.JsonContent);
              }
            }
          })
          .catch();
      }
    },
    
    //获取表单数据
    getFormData(){
     return this.$refs.generateForm.getData();
    },
    handleSubmit () {
      this.$refs.generateForm.getData().then(data => {
        debugger;
        alert(JSON.stringify(data))
      }).catch(e => {
      })
    },
  },
  mounted() {
    this.getFormDesignData();
  },
  // updated(){
  //   debugger
  //   this.getFormDesignData();
  // },
  watch:{
    formDesignId:function (){
      this.getFormDesignData();
    }
  }
};
</script>