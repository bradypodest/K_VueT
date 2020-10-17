<!--
  designform.vue
  设计表单界面-可拖拽生成表单
-->
<template>
  <div>
    <k-form-design 
    ref="kfd"
      :title="formDesignName+' -- by Karl'" 
      :toolbars="['save', 'preview', 'reset','close' ]"
      showToolbarsText
      toolbarsTop
      @save="handleSave"
      @close="closeWindow"
    />
  </div>
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
    handleSave(values) {
      var that=this;
      alert("触发保存方法");
      console.log(values);
debugger;
      //this.$refs.kfd.handleSave();//这行代码会触发Save 事件
      //保存json ,html到对应的表单设计

      that.formDesignData.JsonContent=values;
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
    },
    closeWindow(){
      alert("触发关闭方法");
      //提示用户是否关闭
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

            that.$refs.kfd.handleSetData(JSON.parse(that.formDesignData.JsonContent));
          }
        })
        .catch();
        
  },
  mounted(){
    debugger
    var that=this;
    if(that.formDesignData&&that.formDesignData.JsonContent){
      
      that.$refs.kfd.handleSetData(
JSON.parse(that.formDesignData.JsonContent));
    }
  },
}
</script>