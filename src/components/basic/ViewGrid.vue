<!-- 页面列表组件 -->
<!-- Karl-->
<!-- 20200507-->
<template>
  <div class="layout-container">
    <!-- 导入url  start -->
    <a :href="exportHref" ref="export"></a>
    <!-- 导入url  end -->

    <!-- 表 数据结构  start-->
    <!-- 表 数据结构  end-->

    <!-- 审核  start   能不能考虑下反审核-->
    <!-- 审核 end -->

    <!-- 导入execl start -->
    <!-- 导入execl end-->

    <!-- 手动选择那些列显示 Start   还可以设置前几列固定 -->
    <!-- 手动选择那些列显示 end -->

    <!-- 新增，编辑 start -->
    
    <!-- 新增，编辑 end -->

    <!-- 头部自定义组件 扩展点 start -->
    <!-- 在子组件里用$emit向父组件触发一个事件，父组件监听这个事件就行了  https://www.cnblogs.com/jin-zhe/p/9523782.html -->
    <!-- 触发父组件的方法 ：可见 ViewGridConfig/methods.js中的方法 -->
    <gridHeader ref="gridHeader" @parentCall="parentCall"></gridHeader>
    <!-- 头部自定义组件 扩展点 end -->

    <!-- 主界面查询与table表单布局 start -->
    <div class="view-container">
      <!-- 主界面头 介绍 和 操作按钮 start -->
      <div class="view-header">
        <!-- 文字介绍 -->
        <div class="desc-text" v-if="table.cnName.length>0">
          <i class="el-icon-s-grid"></i>
          <span>{{table.cnName}}</span>
        </div>
        <!-- 备注 -->
        <div class="“remarks”">
          <a class="text" :title="extend.text">{{extend.text}}</a>
        </div>
        <!--快速查询字段 (一个字段))-->
        <div class="search-one"></div>
        <!-- 操作按钮 start -->
        <div class="btn-group"></div>
        <!-- 操作按钮 end -->
      </div>
      <!-- 主界面头 介绍 和 操作按钮 end-->

      <!-- 详细查询条件 start 最好做成下推的样式 -->
      <div class="search-box">
      </div>
      <!-- 详细查询条件 end -->

      <!--body自定义组件-->
      <gridBody ref="gridBody" @parentCall="parentCall"></gridBody>
      <!-- table 表格 start -->
      <div class="grid-container">
      </div>
      <!-- table 表格 end -->

      <!--footer自定义组件-->
    <gridFooter ref="gridFooter" @parentCall="parentCall"></gridFooter>
    </div>
    <!-- 主界面查询与table表单布局 end -->
  </div>
</template>

<script>
var $viewGridVue, $this;
//扩展页面上的自定义组件：可以在表对应的.js中添加
const comName = [
  "gridHeader",
  "gridBody",
  "gridFooter",
  //上面是列表 组件插口 ，下面是弹出框新增，编辑组件插口
  "modelHeader",
  "modelBody",
  "modelFooter"
];
import Empty from "@/components/basic/Empty.vue"; //先用一个空的自定义组件占位置
let _components = {
  //可以在对应的.js中重新进行赋值
  gridHeader: Empty,
  gridBody: Empty,
  gridFooter: Empty,

  modelHeader: Empty,
  modelBody: Empty,
  modelFooter: Empty
};

import KTable from "@/components/basic/KTable.vue";
//自定义组件参数
var vueParam = {
  //viewgrid自定义组件中包含的组件
  components: {
    ..._components,
    KTable: KTable, //列表组件
    UploadExcel: () => import("@/components/basic/UploadExcel.vue") //导入exect 组件
  },
  //对外参数
  props: {},
  data() {
    return {
      _inited: false, //是否已经初始化
      activatedLoad: false, //页面触发actived时是否刷新页面数据
      single: false //表是否单选
    };
  },
  //方法
  methods: {
    //其他方法放在ViewGridConfig文件夹下的methods.js
    ///合并自定义组件   ：不是很懂
    mergeComponents() {
      if (this.extend.components) {
        for (const key in this.extend.components) {
          if (this.extend.components[key]) {
            this.$options.components[key] = this.extend.components[key];
          } else {
            this.$options.components[key] = Empty;
          }
        }
      }
    }
  },
  /////生命周期钩子 start
  beforeCreate() {},
  created() {
    //在其他方法中如果拿不到this，请使用$viewGridVue或$this
    $viewGridVue = this;
    $this = this;
    //合并扩展组件
    this.mergeComponents();

    //合并自定义业务扩展方法
    if (this.extend.methods) {
      for (const key in this.extend.methods) {
        this[key] = this.extend.methods[key]; //这里不懂
      }
    }

    //如果没有指定排序字段，则用主键作为默认排序字段
    this.pagination.sortName = this.table.sortName || this.table.key;

    this.initBoxButtons(); //初始化弹出框与明细表格按钮  //dong?

    //插口onInit
    this.onInit(); //初始化前，如果需要做其他处理在扩展方法中覆盖此方法
    //初始编辑框等数据
    this.initBoxHeightWidth(); //初始化弹出框的高度与宽度

    this.initDicKeys(); //初始下框数据源//初始化字典数据

    //插口 onInited
    this.onInited(); //初始化后，如果需要做其他处理在扩展方法中覆盖此方法
    this.splitButtons = this.getButtons(); //拆分按钮  //生成ViewGrid界面的操作按钮及更多选项
  },
  beforeMount() {},
  mounted() {
    //插口 mounted
    this.mounted();
  },
  //生命周期钩子 activated：在使用了keep-alive后有actived钩子：触发顺序在mounted钩子后
  activated() {
    if (!this._inited) {
      this._inited = true;
      return;
    }

    if (this.activatedLoad) {
      this.refresh(); //刷新
    }

    //合并扩展组件、弹出框新建编辑页面自定义扩展组件或组件路径
    this.mergeComponents();
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
  /////生命周期钩子 end
};

///下面是合并

import props from "./ViewGridConfig/props.js";
//合并属性
vueParam.props = Object.assign(vueParam.props, props); //Object.assign会将后面的参数覆盖前面的数组参数，合并
// const target = { a: 1, b: 2 };
// const source = { b: 4, c: 5 };
// const returnedTarget = Object.assign(target, source);
//则 target      为 { a: 1, b: 4, c: 5 }
//returnedTarget 为 { a: 1, b: 4, c: 5 }

import methods from "./ViewGridConfig/methods.js";
//合并方法
vueParam.methods = Object.assign(
  vueParam.methods,
  methods,
  props.extend.methods //用户重新复写或者添加的方法
);

export default vueParam; //这里就是组件向外公布的
</script>
