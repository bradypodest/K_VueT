<!--
<template>
	<div>
        <vfd></vfd>
    </div>
</template>
-->

// <script>
//     import vfd from 'vfd'

//     export default {
//         name: "vfdcode",
//         components: {
//             vfd
//         }
//     }
//
</script>


<template>
<div>
  <!-- <easyflow :flowName="flowSchemeData.SchemeName" :flowData="flowSchemeData.SchemeContent?JSON.parse(flowSchemeData.SchemeContent):null" :saveFlowInfoData="saveFlowInfoData"> -->
  <!-- <easyflow
    :flowName="flowSchemeDataP?flowSchemeDataP.SchemeName:flowSchemeData.SchemeName"
    :flowData="flowSchemeDataP?JSON.parse(flowSchemeDataP.SchemeContent): JSON.parse(flowSchemeData.SchemeContent)"
    :saveFlowInfoData="saveFlowInfoData"
    ref="easyFlow"
  > -->
  <easyflow
    :flowData="JSON.parse(flowSchemeData.SchemeContent)"
    :saveFlowInfoData="saveFlowInfoData"
    v-if="ID&&flowSchemeData.SchemeContent"
    ref="easyFlow"
    :fieldNames="[]"
  >
  </easyflow>
  <easyflow
    :flowData="JSON.parse(flowSchemeDataP.SchemeContent)"
    :saveFlowInfoData="saveFlowInfoData"
    :IsShowTool="false"
    :IsShowLeft="false"
    :IsShowRight="false"
    v-if="flowSchemeDataP"
    ref="easyFlowP"
  >
  </easyflow>
</div>
</template>

<script>
import easyflow from "@/components/ef/panel.vue";

import { getOneByID, updateOne } from "@/api/flow/flow-scheme.js";

export default {
  name: "easyflowcode",
  components: {
    easyflow,
  },
  props:{
    flowSchemeDataP:{//另一种方法进来的，通过组件props传参
      type:Object,
      default:null
    }
  },
  data() {
    return {
      ID: null,
      flowSchemeData: "",//一种方法进来的，通过路由传入ID,将表单数据保存在这里
      // flowData:"",
      // flowName:"空白流程"

      // emptFlowData:{
      //   name: this.flowSchemeData.SchemeName,
      //   nodeList: [
      //   ],
      //   lineList: [
      //   ]
      // },
    };
  },
  methods: {
    saveFlowInfoData(flowInfoData) {
      var that = this;
      if(that.flowSchemeDataP){
        that.flowSchemeDataP.SchemeContent = JSON.stringify(flowInfoData);
      }else{
        that.flowSchemeData.SchemeContent = JSON.stringify(flowInfoData);
      }
      
      updateOne(that.flowSchemeDataP?that.flowSchemeDataP:that.flowSchemeData)
        .then((res) => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "保存成功!",
            });
          }
        })
        .catch();
    },

    getFlowSchemeInfo(){
      var that=this;
      //获取数据
      getOneByID(that.ID)
        .then((res) => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!",
            });

            that.flowSchemeData = res.data;
            console.log(that.flowSchemeData);
            if (!that.flowSchemeData.SchemeContent) {
              that.flowSchemeData.SchemeContent = JSON.stringify({
                name: that.flowSchemeData.SchemeName,
                nodeList: [],
                lineList: [],
              });
            }
          }
        })
        .catch();
    },

  },
  created() {//一种方法进来的，通过路由传入ID
    var that = this;
    if (this.$route.query.hasOwnProperty("ID")) {
      this.ID = this.$route.query.ID == undefined ? "" : this.$route.query.ID;
      console.log(this.ID);
    }

    if (that.ID) {
      this.getFlowSchemeInfo();
    }
  },
  mounted() {
    var that=this;
    
  },
  watch:{
    flowSchemeDataP:function (){
      this.$refs.easyFlowP.dataReload(JSON.parse(this.flowSchemeDataP.SchemeContent));
    }
  }
};
</script>