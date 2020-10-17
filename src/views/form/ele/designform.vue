<!--
  designform.vue 
  采用组件 ： vue-form-making 
  源码地址：https://github.com/GavinZhuLei/vue-form-making
  设计表单界面-可拖拽生成表单
-->
<template>
  <fm-making-form 
    ref="makingform" 
    style="height: 500px;" 
    preview 
    generate-code 
    generate-json
    clearable
  >
    <template slot="action">
      <!-- 自定义操作区域插槽 -->
      <el-button type="text" icon="el-icon-upload" @click="handleSave">保存</el-button>
    </template>
  </fm-making-form>
</template>

<script>
import {
  getOneByID,
  updateOne
} from "@/api/form/form-design.js";

export default {
  components:{},
  data(){
    return {
      formDesignId:'',
      formDesignName:"表单设计器",
      formDesignData:"",
    }
  },
  
  methods:{
    handleSave() {
      var that=this;
      alert("触发保存方法");
      
debugger;
      //this.$refs.kfd.handleSave();//这行代码会触发Save 事件
      //保存json ,html到对应的表单设计

      that.formDesignData.JsonContent=JSON.stringify(that.$refs.makingform.getJSON());
      that.formDesignData.HtmlContent=that.$refs.makingform.getHtml();
      updateOne(that.formDesignData)
            .then(res => {
              if (res.success) {
                that.$message({
                  type: "success",
                  message: "保存成功!"
                });
              }
            })
            .catch();
    }
  },

  created(){
    var that=this;
    if(this.$route.query.hasOwnProperty('formDesignId'))
    {
      this.formDesignId = this.$route.query.formDesignId == undefined ? '' : this.$route.query.formDesignId; 
      console.log(this.formDesignId);
    }
    if(this.$route.query.hasOwnProperty('formDesignName'))
    {
      this.formDesignName = this.$route.query.formDesignName == undefined ? '' : this.$route.query.formDesignName; 
      console.log(this.formDesignName);
    }
  
  
    if(that.formDesignId)
    //获取数据
      getOneByID(that.formDesignId)
        .then(res => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!"
            });

            that.formDesignData = res.data;
            console.log(that.formDesignData)

            if(that.formDesignData&&that.formDesignData.JsonContent)
              that.$refs.makingform.setJSON(JSON.parse(that.formDesignData.JsonContent));
          }
        })
        .catch();
        
  },
  mounted(){
    debugger
    var that=this;
    //that.$refs.kfd.handleReset(true);
    
    if(that.formDesignData&&that.formDesignData.JsonContent){
        that.$refs.makingform.setJSON(JSON.parse(that.formDesignData.JsonContent));
    }
  },
}
</script>