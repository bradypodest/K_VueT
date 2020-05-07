<!--  范例之 弹出框  -->
<!--  Karl  -->
<!--  2020-04-30  -->

<template>
  <div class="com">
    <div class="d-group" style="  margin-top:30px;">
      <div>
        <h3>上传excel文件</h3>
        <upload-excel 
            :uploadUrl="uploadExcelData.url"
            @importExcelAfter="importAfter"
            >
        </upload-excel>
        <!-- <h3>上传excel文件(有下载)</h3>
        <upload-excel 
            :uploadUrl="uploadExcelData.url"
            :template="uploadExcelData.template"
            @importExcelAfter="importAfter"
            >
        </upload-excel> -->
      </div>
    </div>
  </div>
</template>

<script>
import UploadExcel from "@/components/basic/UploadExcel.vue";//上传excel
export default {
  name: "Popup",
  components:{UploadExcel},
  data(){
    return {
      ///上传execl start
      uploadExcelData:{
        url:"",//上传的URL
        template:{//下载模板的数据
          url:"/api/App_TransactionAvgPrice/DownLoadTemplate",
          fileName:"MyLOVE"
        }
      }

      ///上传execl  end

    }
  },
  methods: {
      ///上传execl 文件 start
      importAfter(){
        this.$message.success("执行上传文件成功执行的父方法")
      }

      ///上传execl 文件 end
  },
}
</script>
<style lang="less" scoped>
.com > div {
  margin-top: 30px;
}

.d-group {
  display: inline-block;
  width: 100%;
  > div {
    float: left;
    width: 49%;
  }
  > div:first-child {
    margin-right: 2%;
    margin-left: 2%;
  }
}

</style>

