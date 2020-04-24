<!-- 导入execl文件 -->
<!-- Karl-->
<!-- 20200421-->
<template>
  <div class="upload-container">
    <div class="button-group">
      <el-upload
        :action="uploadUrl"
        :limit="maxNum"
        :multiple="isMultiple"
        :before-upload="beforeUpload"
        :before-remove="beforeRemove"
        :on-error="uploadError"
        :file-list="fileList"
      >
        <el-button slot="trigger" type="primary">选择文件</el-button>
        <el-button v-if="template.url" type="info" @click="downloadTemplate">下载模板</el-button>
        <el-button
          style="margin-left: 10px;"
          type="success"
          @click="submitUpload"
          :loading="loadingStatus"
        ></el-button>
        <div slot="tip" class="el-upload__tip">{{mark}}</div>
      </el-upload>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {}, //element-ui的组件因为在系统中全局了，
  props: {
    uploadUrl: {
      //上传url ，必要
      type: String,
      default: ""
    },
    mark: {
      //备注上传的条件
      type: string,
      default: "只能上传excel、xls、xlsx文件,文件大小不超过5M"
    },
    maxSize: {
      //上传单个文件的大小  MB
      type: int32,
      default: 1024 * 5
    },
    maxNum: {
      //最大上传个数
      type: int32,
      default: 1
    },
    isMultiple: {
      type: boolean,
      default: false
    },

    template: {
      type: Object,
      default: () => {
        return {
          url: "", //模板下载路径，如果没有模板路径，则“下载模板”按钮不限
          fileName: "未定义文件名" //下载模板的文件名称
        };
      }
    },
    data() {
      return {
        fileList: [], //上传文件
        loadingStatus: false //上传的加载数据
      };
    },
    methods: {
      ///上传文件之前
      beforeUpload(file) {
        var that=this;
        var suffixStr=file.name.substring(file.name.lastIndexOf('.')+1)                
        const extension = suffixStr === 'xls'
        const extension2 = suffixStr === 'xlsx'
        const extension3 = suffixStr === 'excel'
        const isLt2M = file.size   < that.maxSize
        if((!extension) || (!extension2||((!extension3)))) {
            this.$message({
                message: that.mark,
                type: 'warning'
            });

            return false;
        }
        if(!isLt2M) {
            this.$message({
                message: '上传文件大小不能超过 '+that.maxSize/1024+'MB!',
                type: 'warning'
            });
            return false;
        }
        return true;
      },
      ///移除文件之前
      beforeRemove(file,fileList){
        console.log("移除文件"+file.name);
      }

    }
  }
};
</script>

