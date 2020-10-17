<!--
  采用组件 ：k-form-design （不兼容，废弃）
  源码地址： https://github.com/Kchengz/k-form-design
  设计表单界面-可拖拽生成表单
-->
<template>
  <div>
    <k-form-build :value="jsonData" />
  </div>
</template>

<script>
import {
  getOneByID,
  updateOne
} from "@/api/form/form-design.js";
export default {
  props:{
    formDesignId:{
      type: String,
    }
  },
  data(){
    return{
      formDesignData:'',
      jsonData:'',//表单json配置数据
      // jsonData: {
      //   list: [
      //     {
      //       type: 'input',
      //       label: '单行文本',
      //       options: {
      //         width: '100%',
      //         defaultValue: '',
      //         placeholder: '请输入',
      //         disabled: false
      //       },
      //       model: 'input_1577875678405',
      //       key: 'input_1577875678405',
      //       rules: [{ required: true, message: '必填项' }]
      //     },
      //     {
      //       type: 'date',
      //       label: '日期选择器',
      //       options: {
      //         width: '100%',
      //         defaultValue: '',
      //         range: false,
      //         showTime: false,
      //         disabled: false,
      //         clearable: false,
      //         placeholder: '请选择',
      //         rangePlaceholder: ['开始时间', '结束时间'],
      //         format: 'YYYY-MM-DD'
      //       },
      //       model: 'date_1577877450971',
      //       key: 'date_1577877450971',
      //       rules: [{ required: true, message: '必填项' }]
      //     },
      //     {
      //       type: 'textarea',
      //       label: '多行文本',
      //       options: {
      //         width: '100%',
      //         minRows: 4,
      //         maxRows: 6,
      //         defaultValue: '',
      //         disabled: false,
      //         placeholder: '请输入'
      //       },
      //       model: 'textarea_1577877446659',
      //       key: 'textarea_1577877446659',
      //       rules: [{ required: true, message: '必填项' }]
      //     },
      //     {
      //       type: 'rate',
      //       label: '评分',
      //       options: {
      //         defaultValue: 0,
      //         max: 5,
      //         disabled: false,
      //         allowHalf: false
      //       },
      //       model: 'rate_1577877468717',
      //       key: 'rate_1577877468717',
      //       rules: [{ required: true, message: '必填项' }]
      //     }
      //   ],
      //   config: {
      //     layout: 'horizontal',
      //     labelCol: { span: 4 },
      //     wrapperCol: { span: 18 },
      //     hideRequiredMark: false,
      //     customStyle: ''
      //   }
      // },
    }
  },

  methods:{
    //获取表单设计的设计数据
    getFormDesignData() {
      var that=this;
      getOneByID(that.formDesignId)
        .then(res => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!"
            });

            that.formDesignData = res.data;
            console.log(that.formDesignData)
debugger
            if(that.formDesignData.JsonContent)
              that.jsonData=JSON.parse(that.formDesignData.JsonContent);
          }
        })
        .catch();
    }
  },
  mounted(){
    this.getFormDesignData();
  }
}
</script>