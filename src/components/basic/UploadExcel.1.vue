<!-- 导入execl文件 -->
import { delOne } from '@/api/system/sys-user';
<!-- Karl-->
<!-- 20200421-->
<template>
  <div class="upload-container">
    <a :href="template.url" ref="template"></a>
    <div class="button-group">
      <el-upload
        class="elupload"
        ref="uploadExcel"
        :action="uploadUrl"
        :on-change="handleChange"
        :before-upload="beforeUpload"
        :before-remove="beforeRemove"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button type="primary">选择文件</el-button>
        <el-button v-if="template.url" type="info" @click="downloadTemplate">下载模板</el-button>
        <el-button
          style="margin-left: 10px;"
          type="success"
          @click="submitUpload"
          :loading="loadingStatus"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">{{mark}}</div>
      </el-upload>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadExcel",
  components: {}, //element-ui的组件因为在系统中全局了，
  props: {
    uploadUrl: {
      //上传url ，必要
      type: String,
      default: ""
    },
    mark: {
      //备注上传的条件
      type: String,
      default: "只能上传excel、xls、xlsx文件,文件大小不超过5M"
    },
    template: {
      type: Object,
      default: () => {
        return {
          url: "", //模板下载路径，如果没有模板路径，则“下载模板”按钮不限
          fileName: "未定义文件名" //下载模板的文件名称
        };
      }
    }
  },
  data() {
    return {
      fileList: [], //上传文件
      loadingStatus: false, //上传的加载数据
      maxSize: 1024 * 5, //上传单个文件的大小  MB
      //maxNum: 1, //最大上传个数
      isMultiple: false //是否支持多选文件
    };
  },
  methods: {
    ///上传文件之前
    beforeUpload(file) {
      var that = this;
      var suffixStr = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = suffixStr === "xls";
      const extension2 = suffixStr === "xlsx";
      const extension3 = suffixStr === "excel";
      const isLt2M = file.size < that.maxSize;
      if (!extension || (!extension2 || !extension3)) {
        this.$message({
          message: that.mark,
          type: "warning"
        });

        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 " + that.maxSize / 1024 + "MB!",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    ///移除文件之前
    beforeRemove(file, fileLists) {
      console.log("移除文件" + file.name);
    },
    ///文件列表有变化时
    handleChange(file, fileLists) {
      if (fileLists.length > 0) {
        this.fileList = [fileLists[fileLists.length - 1]]; // 这一步，是 展示最后一次选择的文件
      }
    },
    ///上传文件错误
    uploadError(err, file, fileLists) {
      console.log("上传文件错误" + file.name);
      this.loadingStatus = false;
    },
    ///上传文件成功
    uploadSuccess(response, file, fileLists) {
      console.log("上传文件成功" + file.name);
      this.loadingStatus = false;
      this.$message.success("上传文件成功");

      this.$emit("importExcelAfter", x); //执行父组件传递过来的方法
    },
    ///下载模板
    downloadTemplate() {
      let url = this.template.url;

      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("GET", url, true);
      xmlResquest.setRequestHeader("Content-type", "application/json");

      //放入token
      xmlResquest.setRequestHeader(
        "Authorization",
        //this.$store.getters.getToken()
        "Bearer " + this.$store.getters.token
      );

      let fileName = this.template.fileName + ".xlsx";
      let elink = this.$refs.template;
      xmlResquest.responseType = "blob";
      let $_vue = this;
      this.loadingStatus = true;
      xmlResquest.onload = function(oEvent) {
        $_vue.loadingStatus = false;
        if (xmlResquest.response.type == "application/json") {
          //return $_vue.message.error("未找到下载文件");
          return $_vue.$message.error("未找到下载文件");
        }
        let content = xmlResquest.response;
        elink.download = fileName;
        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        elink.click();
      };
      xmlResquest.send();
    },
    ///提交上传
    submitUpload() {
      if (!this.url) {
        return this.$message.error("没有配置好Url");
      }
      if (this.fileList.length <= 0) {
        return this.$message.error("请选择文件");
      }

      this.$nextTick(() => {
        this.$refs.uploadExcel.submit();
      });
      // var forms = new FormData();
      // forms.append("fileInput", this.fileList[0]);//现阶段只支持一个
      // this.loadingStatus = true;
      // this.http.post(this.url, forms).then(
      //   x => {
      //     // this.$refs.uploadFile.clearFiles();
      //     this.loadingStatus = false;
      //     this.file = null;
      //     this.$emit('importExcelAfter',x);
      //     this.$message.error(x.message);
      //     //刷新表格数据
      //   },
      //   error => {
      //     this.loadingStatus = false;
      //   }
      // );
    }
  }
};
</script>

<style lang="less" scoped>
.upload-container {
  display: inline-block;
  width: 100%;
  padding: 10px;
  border: 1px dashed #2d8cf0;
  min-height: 250px;
  border-radius: 5px;
  .alert {
    margin-top: 43px;
  }
  .button-group > * {
    float: left;
    margin-right: 10px;
  }
  .file-info > span {
    margin-right: 20px;
  }
}

.elupload 
// {
//   display: flex;
// }
/deep/ .el-list-enter-active,
/deep/ .el-list-leave-active {
  transition: none;
}
/deep/ .el-list-enter,
/deep/ .el-list-leave-active {
  opacity: 0;
}
/deep/ .el-upload-list {
  height: 40px;
}

</style>