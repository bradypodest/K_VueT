<!--  范例之 弹出框  -->
<!--  Karl  -->
<!--  2020-04-30  -->

<template>
  <div class="com">
    <div class="d-group" style="  margin-top:30px;">
      <div>
        <h3>上传excel文件</h3>
        <upload-excel :uploadUrl="uploadExcelData.url" @importExcelAfter="importAfter"></upload-excel>
        <!-- <h3>上传excel文件(有下载)</h3>
        <upload-excel 
            :uploadUrl="uploadExcelData.url"
            :template="uploadExcelData.template"
            @importExcelAfter="importAfter"
            >
        </upload-excel>-->
      </div>
    </div>
    <!-- 封装弹出框 -->
    <div class="d-group" style="  margin-top:30px;">
      <div>
        <h3>打开对话框</h3>
        <el-button @click="openDialog">打开</el-button>
        <kv-dialog
          :isShow.sync="kDialogData.viewModel"
          :height="kDialogData.height"
          :width="kDialogData.width"
          :title="kDialogData.title+'测试对话框'"
        >
          <div slot="content">
            <upload-excel :uploadUrl="uploadExcelData.url" @importExcelAfter="importAfter"></upload-excel>
            <span>中间内容</span>
            <br>
            <br>
            <div>sssss</div>
            <span>中间内容</span>
            <br>
            <br>
            <div>sssss</div>
            <span>中间内容</span>
            <br>
            <br>
            <div>sssss</div>
            <span>中间内容</span>
            <br>
            <br>
            <div>sssss</div>
            <span>中间内容</span>
            <br>
            <br>
            <div>sssss</div>
          </div>
        </kv-dialog>
      </div>
    </div>    
  </div>
</template>

<script>
import UploadExcel from "@/components/basic/UploadExcel.vue"; //上传excel
import KvDialog from "@/components/basic/KvDialog.vue";
export default {
  name: "Popup",
  components: { UploadExcel, KvDialog },
  data() {
    return {
      ///上传execl start
      uploadExcelData: {
        url: "", //上传的URL
        template: {
          //下载模板的数据
          url: "/api/App_TransactionAvgPrice/DownLoadTemplate",
          fileName: "MyLOVE"
        }
      },

      ///上传execl  end

      ///对话框 封装 Start
      kDialogData: {
        viewModel: false,
        height: 100,
        width: "50%",
        title: "ce"
      }

      ///对话框 封装 end
    };
  },
  methods: {
    ///上传execl 文件 start
    importAfter() {
      this.$message.success("执行上传文件成功执行的父方法");
    },

    ///上传execl 文件 end

    ///对话框 封装 Start
    openDialog() {
      this.kDialogData.viewModel = true;
    }
    ///对话框 封装 end
  }
};
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

