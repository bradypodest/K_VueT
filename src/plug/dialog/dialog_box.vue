<template>
  <el-dialog
    :customClass="customClass"
    :close-on-click-modal="closeOnClickModal"
    class="dialog"
    :visible.sync="valid"
    @close="closing"
    :before-close="close"
    :title="title"
  >
    <div
      ref="component"
      class="height-full padding-left-5 padding-right-5 background-6F9"
    ></div>
    <span v-if="isShowFoorter" slot="footer" class="dialog-footer">
      <el-button @click="cancel('cancel')">取消</el-button>
      <el-button type="primary" @click="confirm('confirm')">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from "vue";
export default {
  //name: this.name,
  name: "showBox",
  props: {
    name: {
      type: String,
      default: "showBox", //默认样式
    },
    //弹窗样式
    customClass: {
      type: String,
      default: "dialog-medium", //默认样式
    },
    //弹窗标题
    title: {
      type: String,
      default() {
        return "对话框";
      },
    },
    //是否显示底部按钮
    isShowFoorter: {
      type: Boolean,
      default: true, //默认标题
    },
    //是否可以通过点击 modal 关闭 Dialog
    closeOnClickModal: {
      type: Boolean,
      default: true, //默认标题
    },
    //使用模板类型
    templateType: {
      type: String,
      default: "TEMPLATE", 
    },
    // //模板地址
    // templateURL: {
    //   type: String,
    // },
    //模板对象
    template: {
      type: Object,
    },
    //模板参数
    templateProps: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },

  data() {
    return {
      closeWindowEvent: undefined,
      valid: false,
      resolve: "",
      reject: "",
      promise: "", // 保存promise对象
    };
  },
  methods: {
    //初始化
    initTemplate() {
      if (this.valid) {
        // if (this.templateType === "URL" && this.templateUrl) {
        //   import("@/" + this.templateUrl).then((template) => {
        //     this.loadTemplate(template);
        //   });
        // } else 
        if (this.templateType === "TEMPLATE" && this.template) {
          this.loadTemplate(this.template);
        }
      }
    },
    //加载模板
    loadTemplate(template) {
      let templ = Vue.extend(template);
      let Instance = new templ({
        //合并参数
        propsData: Object.assign(
          {
            confirm: this.confirm,
            cancel: this.cancel,
          },
          this.templateProps
        ),
      });
      this.closeWindowEvent = Instance.closeWindowEvent;
      Instance.$mount(); //手动挂载
      this.$refs.component.innerHTML = "";
      this.$refs.component.appendChild(Instance.$el);
    },

    // 弹出messageBox,并创建promise对象
    show() {
      this.valid = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      // 返回promise对象
      return this.promise;
    },
    // 确定,将promise断定为resolve状态
    confirm(val) {
      this.valid = false;
      this.resolve(val);
    },
    //取消
    cancel(val) {
      this.valid = false;
      this.reject(val);
    },
    //点击 X 关闭对话框
    close(done) {
      if (
        this.closeWindowEvent &&
        typeof this.closeWindowEvent === "function"
      ) {
        this.closeWindowEvent();
      } else {
        this.reject("close");
        done();
      }
    },
    // 关闭中销毁窗口
    closing() {
      this.remove();
    },
    remove() {
      setTimeout(() => {
        this.destroy();
      }, 300);
    },
    destroy() {
      this.$destroy();
      document.body.removeChild(this.$el);//this指向组件的实例。$el指向当前组件的DOM元素
    },
  },
  updated() {
      this.initTemplate()//初始化模板
  },
};
</script>

<style>
  .dialog .el-dialog__headerbtn {
    top: auto;
  }

  .dialog .el-dialog__title {
    line-height: 16px;
    font-size: 16px
  }
</style>