<template>
  <!-- 二次封装element对话框 -->
  <!-- 
    close-on-click-modal  点击遮罩层是否关闭，默认true
    show-close="false"  是否显示右上角关闭按钮 默认true
    close-on-press-escape 是否可以通过按下 ESC 关闭 Dialog 默认 true
    title    Dialog 的标题
    width   弹出框的宽度（默认50%）也可以使用‘100px’，如果直接在el-dialog上赋值，不需要前面的冒号
            如果间接的赋值则需要加上冒号，
    visible  是否显示 Dialog，支持 .sync 修饰符  默认false
  -->
  <el-dialog
    :close-on-click-modal="false"
    :show-close="true"
    :close-on-press-escape="false"
    :title="title"
    :width="width+'px'"
    :visible.sync="dialogVisible"
    custom-class="dialog-custom-class"
    @close="closeDialog"
    top="4vh"
  >
    <!-- 这里的插槽会替换title显示的内容 -->
    <div slot="title" class="header-title">
      <i :class="titleIcon"></i>
      <span>{{title}}</span>
    </div>
    <div class="dialog-content" :style="{height:height+'px'}">
      <el-scrollbar style="height:100%;">
        <div class="srcoll-content" :style="{'padding-left':paddinglr+'px','padding-right':paddinglr+'px','padding-top':paddingtb+'px','padding-bottom':paddingtb+'px'}">
          
          <slot name="content"></slot>
          <slot></slot>
        </div>
      </el-scrollbar>
      <!-- <slot name="content"></slot>
          <slot></slot> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <slot name="footer"></slot>
      <!-- <el-button size="" type="info" @click="closeDialog">取 消</el-button>      -->
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "KvDialog",
  props: {
    title: {
      type: String,
      default: "基本信息"
    },
    width: {//整个宽度
      type: Number,
      default: 650 
    },
    isShow: {
      //是否显示dialog
      type: Boolean,
      default: false
    },
    titleIcon: {//title的图标
      type: String,
      default: "el-icon-info"
    },
    height:{//中心内容高度
      type: Number,
      default: 350
    },
    paddinglr: {//中心内容边距  左右
      type: Number,
      default: 16
    },
    paddingtb: {//中心内容边距  上下
      type: Number,
      default: 5
    },
  },
  data() {
    return {
      dialogVisible: this.isShow
    };
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.$emit("update:isShow", false); //修改父组件的参数
    }
  },
  watch: {
    isShow() {
      this.dialogVisible = this.isShow;
    }
  }
};
</script>
<style lang="less">
.dialog-custom-class {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    .el-dialog__close{
      color: white;
    }
  /* 顶部 */
  .el-dialog__header {
    //border-bottom: 1px solid #ccc;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 18px 15px;
    background-image: linear-gradient(
      135deg,
      rgb(12, 141, 215) 10%,
      #57c5f7 100%
    );
  }
  .header-title{
    color: white;
  }
  .el-dialog__body {
    padding: 3px 0px;
  }
  
  .dialog-content {
    min-height: 180px;
  }
  .srcoll-content {
    height: 100%;
    word-break: break-all;
    // padding-top: 5px;
    // padding-bottom: 5px;
    //  padding: 16px;
  }
  .el-scrollbar__wrap{overflow-x:hidden;}
  .el-dialog__footer {
    border-top: 1px solid #ccc;
    padding: 8px 15px;
  }
}
</style>
