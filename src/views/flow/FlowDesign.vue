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
  <easyflow :flowName="flowSchemeData.SchemeName" :flowData="JSON.parse(flowSchemeData.SchemeContent)" :saveFlowInfoData="saveFlowInfoData">
  </easyflow>
</template>

<script>
import easyflow from "@/components/ef/panel.vue";

import {
  getOneByID,
  updateOne
} from "@/api/flow/flow-scheme.js";

export default {
  name: "easyflowcode",
  components: {
    easyflow,
  },
  data() {
    return {
      ID: "",
      flowSchemeData: "",
      // flowData:"",
      // flowName:"空白流程"
    };
  },
  methods: {
    saveFlowInfoData(flowInfoData) {
      var that=this;
      that.flowSchemeData.SchemeContent=JSON.stringify(flowInfoData);
      updateOne(that.flowSchemeData)
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
  },
  created() {
    var that = this;
    if (this.$route.query.hasOwnProperty("ID")) {
      this.ID =
        this.$route.query.ID == undefined
          ? ""
          : this.$route.query.ID;
      console.log(this.ID);
    }

    if(that.ID){
      //获取数据
      getOneByID(that.ID)
        .then(res => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!"
            });

            that.flowSchemeData = res.data;
            console.log(that.flowSchemeData)

          }
        })
        .catch();
    }
  },
  mounted() {
  },
};
</script>